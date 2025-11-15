// src/modules/users/user.service.js
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const repository = require("./user.repository");
const nodemailer = require("nodemailer");

const PUBLIC_BASE = "/uploads/users";

const toPublicPath = (file) => (file ? `${PUBLIC_BASE}/${file.filename}` : null);

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const removeLocalFile = (publicPath) => {
  try {
    if (!publicPath) return;
    const full = path.join(__dirname, "../../uploads", publicPath.replace("/uploads/", ""));
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (_) {}
};

// Transporter usando Hostinger — mesmo que antes
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LUMMEN || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT_LUMMEN) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER_LUMMEN, 
    pass: process.env.SMTP_PASS_LUMMEN,
  },
  tls: { rejectUnauthorized: false },
});

function buildResetPasswordEmailHTML({ name, resetUrl }) {
  const safeName = name || 'there';

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Reset your password</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:24px; }
        .card { max-width:560px; margin:0 auto; background:#fff; border-radius:12px; padding:24px; }
        h1 { font-size:20px; margin:0 0 12px; color:#111; }
        p { font-size:14px; color:#333; line-height:1.5; }
        .cta { display:inline-block; margin-top:16px; padding:12px 20px; border-radius:8px; text-decoration:none; background:#111827; color:#fff; font-weight:600; }
        .footer { margin-top:24px; font-size:12px; color:#777; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Reset your password</h1>
        <p>Hi ${safeName},</p>
        <p>You requested to reset your Lummen account password.</p>
        <p>Click the button below to create a new password:</p>
        <a class="cta" href="${resetUrl}" target="_blank" rel="noopener noreferrer">Reset password</a>
        <p class="footer">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    </body>
  </html>`;
}

module.exports = {
  async register(payload, file) {
    let { email, password, isPaid, status } = payload;

    if (!email || !password) throw new Error("email e password são obrigatórios");
    if (!file) throw new Error("photo é obrigatória");

    email = normalizeEmail(email);

    const exists = await repository.findByEmail(email);
    if (exists) throw new Error("E-mail já cadastrado");

    const hash = await bcrypt.hash(password, 10);
    const photoPath = toPublicPath(file);

    const user = await repository.createUser({
      email,
      password: hash,
      isPaid: Boolean(isPaid),
      status: status || undefined,
      photo: photoPath
    });

    // criar tabelas associadas
    await repository.createUserProfile(user.id);
    await repository.createUserPreference(user.id);
    await repository.createUserPhoto(user.id, photoPath);
    const credit = await repository.createBoostCredit(user.id);
    await repository.createBoostActivation(user.id, credit.id);
    await repository.createPlaceholderPayment(user.id);

    // gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    // BUSCAR DADOS COMPLETOS AQUI
    const fullUser = await repository.findOne(user.id);

    return { user: fullUser, token };
  },

  async login(email, password) {
    email = normalizeEmail(email);

    const user = await repository.findByEmail(email);
    if (!user) throw new Error("Credenciais inválidas");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    // BUSCAR DADOS COMPLETOS AQUI
    const fullUser = await repository.findOne(user.id);

    return { user: fullUser, token };
  },

  async list(query, loggedUserId) {
  const page = Math.max(parseInt(query.page || "1"), 1);
  const limit = Math.max(parseInt(query.limit || "20"), 1);
  const skip = (page - 1) * limit;

  const q = (query.q || "").trim().toLowerCase();
  const where = q ? { email: { contains: q } } : {};

  // EXCLUIR O USUÁRIO LOGADO DO FEED
  where.id = { not: loggedUserId };

  const [total, items] = await Promise.all([
    repository.count(where),
    repository.list({ skip, limit, where })
  ]);

  return { page, limit, total, pages: Math.ceil(total / limit), items };
},

  async update(id, data, file) {
    const updateData = { ...data };

    if (file) updateData.photo = toPublicPath(file);

    await repository.updateUser(id, updateData);

    // RETORNAR TUDO COMPLETO
    return repository.findOne(id);
  },

  async remove(id) {
    const user = await repository.findOne(id);
    if (!user) throw new Error("Usuário não encontrado");

    removeLocalFile(user.photo);

    await repository.deleteUser(id);
    return true;
  },

  async getOne(id) {
  const user = await repository.findOne(id);
  if (!user) throw new Error("Usuário não encontrado");
  return user;
},

   async setPaidWebhook({ email, days }) {
    if (!email || !days) {
      throw new Error("email e days são obrigatórios");
    }

    const user = await repository.findByEmailBasic(email);
    if (!user) throw new Error("Usuário não encontrado");

    const expiration = dayjs().add(Number(days), "day").toDate();

    const updated = await repository.updatePaid(email, expiration);

    return {
      success: true,
      message: `Usuário ${email} marcado como pago por ${days} dias.`,
      data: updated,
    };
  },

  async updatePassword(userId, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword)
    throw new Error("currentPassword e newPassword são obrigatórios");

  const user = await repository.findByIdBasic(userId);
  if (!user) throw new Error("Usuário não encontrado");

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) throw new Error("Senha atual incorreta");

  const newHash = await bcrypt.hash(newPassword, 10);

  await repository.updatePassword(userId, newHash);

  return { success: true, message: "Senha atualizada com sucesso" };
},

async forgotPassword(email) {
  if (!email) throw new Error("email é obrigatório");

  const normalized = email.trim().toLowerCase();

  const user = await repository.findByEmailForReset(normalized);

  // Sempre responder OK sem denunciar se existe ou não
  if (!user) {
    return {
      success: true,
      message: "Se este e-mail estiver cadastrado, enviaremos um link de redefinição."
    };
  }

  // Token
  const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || "reset_dev_key";

  const token = jwt.sign(
    { id: user.id, email: user.email, type: "password_reset" },
    resetSecret,
    { expiresIn: "1h" }
  );

  const baseUrl = process.env.FRONTEND_RESET_URL || "https://lummenapp.com/reset-password";
  const resetUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;

  const html = buildResetPasswordEmailHTML({
    name: user.email.split("@")[0],
    resetUrl
  });

  await mailTransporter.sendMail({
    from: `"Lummen App" <${process.env.SMTP_USER_LUMMEN}>`,
    to: user.email,
    subject: "Lummen – Reset your password",
    text: `Hi! Use the link below to reset your password (valid for 1 hour): \n\n${resetUrl}`,
    html
  });

  return {
    success: true,
    message: "Se este e-mail estiver cadastrado, enviaremos um link de redefinição."
  };
},

async resetPassword({ token, newPassword }) {
  if (!token || !newPassword)
    throw new Error("token e newPassword são obrigatórios");

  const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || "reset_dev_key";

  let payloadDecoded;
  try {
    payloadDecoded = jwt.verify(token, resetSecret);
  } catch (e) {
    throw new Error("Token inválido ou expirado");
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await repository.updatePassword(payloadDecoded.id, newHash);

  return { success: true, message: "Senha redefinida com sucesso" };
},

async changePassword(userId, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword)
    throw new Error("currentPassword e newPassword são obrigatórios");

  const user = await repository.findByIdBasic(userId);
  if (!user) throw new Error("Usuário não encontrado");

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) throw new Error("Senha atual incorreta");

  const newHash = await bcrypt.hash(newPassword, 10);

  await repository.updatePassword(userId, newHash);

  return { success: true, message: "Senha atualizada com sucesso" };
}




};
