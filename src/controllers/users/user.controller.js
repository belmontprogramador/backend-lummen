// src/controllers/users/user.controller.js
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../dataBase/prisma');
const axios = require('axios');
const nodemailer = require("nodemailer"); 

const PUBLIC_BASE = '/uploads/users';

const toPublicPhotoPath = (file) => (file ? `${PUBLIC_BASE}/${file.filename}` : null);
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const absFromPublic = (publicPath) => {
  if (!publicPath) return null;
  const uploadsRoot = path.join(__dirname, '../../uploads'); // <projeto>/src/uploads
  const rel = publicPath.replace(/^\/?uploads\//, '');       // users/xxx.jpg
  return path.join(uploadsRoot, rel);
};

const removeIfExists = (absPath) => {
  try { if (absPath && fs.existsSync(absPath)) fs.unlinkSync(absPath); } catch (_) {}
};

// transporter usando a conta Hostinger do Lummen
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LUMMEN || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT_LUMMEN) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER_LUMMEN, // ex: donotreply@lummenapp.com
    pass: process.env.SMTP_PASS_LUMMEN,
  },
  tls: { rejectUnauthorized: false },
});

// HTML com botão para reset de senha
function buildResetPasswordEmailHTML({ name, resetUrl }) {
  const safeName = name || 'there';
  const safeUrl = resetUrl;

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
        .cta { display:inline-block; margin-top:16px; padding:12px 20px; border-radius:8px; text-decoration:none; 
               background:#111827; color:#fff; font-weight:600; }
        .footer { margin-top:24px; font-size:12px; color:#777; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Reset your password</h1>
        <p>Hi ${safeName},</p>
        <p>You requested to reset your Lummen account password.</p>
        <p>Click the button below to create a new password:</p>
        <a class="cta" href="${safeUrl}" target="_blank" rel="noopener noreferrer">Reset password</a>
        <p class="footer">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    </body>
  </html>`;
}

// ---------- CRIAR (register) ----------
exports.create = async (req, res) => {
  try {
    let { email, password, isPaid, status } = req.body;
    const file = req.file; // multer.single('photo')

    if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });
    if (!file) return res.status(400).json({ error: 'photo é obrigatória (multipart/form-data)' });

    email = normalizeEmail(email);

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'E-mail já cadastrado' });

    const hash = await bcrypt.hash(password, 10);
    const photoPath = toPublicPhotoPath(file);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        photo: photoPath,
        isPaid: Boolean(isPaid),
        status: status || undefined,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_dev_key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        photo: user.photo,
        isPaid: user.isPaid,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (err) {
    if (err?.code === 'P2002' && err?.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }
    return res.status(400).json({ error: err.message });
  }
};

// ---------- LOGIN ----------
exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_dev_key',
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        photo: user.photo,
        isPaid: user.isPaid,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ---------- LISTAR ----------
exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
  const skip = (page - 1) * limit;

  const q = (req.query.q || '').trim().toLowerCase();
  const where = q ? { email: { contains: q } } : {};

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, photo: true, isPaid: true, status: true, createdAt: true, updatedAt: true,
      },
    }),
  ]);

  res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
};

// ---------- OBTER UM ----------
exports.getOne = async (req, res) => {
  const { id } = req.params;
  const u = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, photo: true, isPaid: true, status: true, createdAt: true, updatedAt: true,
    },
  });
  if (!u) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(u);
};

// ---------- ATUALIZAR (parcial) ----------
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    let { email, password, isPaid, status } = req.body;
    const file = req.file; // multer.single('photo')

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Usuário não encontrado' });

    const data = {};

    if (email !== undefined) {
      email = normalizeEmail(email);
      const conflict = await prisma.user.findUnique({ where: { email } });
      if (conflict && conflict.id !== id) {
        return res.status(409).json({ error: 'E-mail já utilizado por outro usuário' });
      }
      data.email = email;
    }

    if (password !== undefined) {
      if (!password) return res.status(400).json({ error: 'password não pode ser vazio' });
      data.password = await bcrypt.hash(password, 10);
    }

    if (isPaid !== undefined) data.isPaid = Boolean(isPaid);
    if (status !== undefined) data.status = status;

    if (file) {
      const newPublic = toPublicPhotoPath(file);
      const oldAbs = absFromPublic(existing.photo);
      removeIfExists(oldAbs);
      data.photo = newPublic;
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, email: true, photo: true, isPaid: true, status: true, createdAt: true, updatedAt: true,
      },
    });

    res.json(updated);
  } catch (err) {
    if (err?.code === 'P2002' && err?.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }
    return res.status(400).json({ error: err.message });
  }
};

// ---------- REMOVER ----------
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe e pega o caminho da foto
    const existing = await prisma.user.findUnique({
      where: { id },
      select: { photo: true, email: true }
    });
    if (!existing) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Remove do banco
    await prisma.user.delete({ where: { id } });

    // Remove arquivo local
    const abs = absFromPublic(existing.photo);
    removeIfExists(abs);

    // ✅ Retorna resposta amigável de sucesso
    return res.status(200).json({
      success: true,
      message: `Usuário ${existing.email} foi removido com sucesso.`,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ---------- SET STATUS ----------
exports.setStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // ACTIVE | INACTIVE | SUSPENDED
  if (!status) return res.status(400).json({ error: 'status é obrigatório' });
  const user = await prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, email: true, photo: true, isPaid: true, status: true, createdAt: true, updatedAt: true },
  });
  res.json(user);
};

// ---------- SET PAID ----------
exports.setPaidWebhook = async (req, res) => {
  try {
    const { email, days } = req.body;

    if (!email || !days) {
      return res.status(400).json({ error: 'E-mail e dias são obrigatórios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const expiration = dayjs().add(Number(days), 'day').toDate();

    const updated = await prisma.user.update({
      where: { email },
      data: {
        isPaid: true,
        paidUntil: expiration,
      },
      select: {
        id: true,
        email: true,
        isPaid: true,
        paidUntil: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      message: `Usuário ${email} marcado como pago por ${days} dias.`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar status de pagamento', detail: err.message });
  }
};

// ---------- UPDATE PASSWORD (usuário logado) ----------
exports.updatePassword = async (req, res) => {
  try {
    // pega o id do usuário autenticado (preenchido pelo requireAuth)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword e newPassword são obrigatórios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    // busca usuário com a senha atual
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // confere senha atual
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // gera hash da nova senha
    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });

    return res.json({
      success: true,
      message: 'Senha atualizada com sucesso',
    });
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    return res.status(400).json({ error: err.message });
  }
};

// ---------- FORGOT PASSWORD (usuário não lembra a senha) ----------
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'email é obrigatório' });
    }

    email = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Sempre respondemos "ok" mesmo se o e-mail não existir,
    // para não deixar ninguém adivinhar quem está cadastrado.
    if (!user) {
      return res.json({
        success: true,
        message: 'Se este e-mail estiver cadastrado, enviaremos um link de redefinição.',
      });
    }

    const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || 'reset_dev_key';

    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'password_reset' },
      resetSecret,
      { expiresIn: '1h' } // link válido por 1 hora
    );

    const baseUrl = process.env.FRONTEND_RESET_URL || 'https://lummenapp.com/reset-password';
    const resetUrl = `${baseUrl}?token=${encodeURIComponent(resetToken)}`;

    const html = buildResetPasswordEmailHTML({
      name: user.email.split('@')[0],
      resetUrl,
    });

    await mailTransporter.sendMail({
      from: `"Lummen App" <${process.env.SMTP_USER_LUMMEN}>`,
      to: user.email,
      subject: 'Lummen – Reset your password',
      text: `Hi! Use the link below to reset your password (valid for 1 hour):\n\n${resetUrl}`,
      html,
    });

    return res.json({
      success: true,
      message: 'Se este e-mail estiver cadastrado, enviaremos um link de redefinição.',
    });
  } catch (err) {
    console.error('Erro forgotPassword:', err);
    return res.status(500).json({ error: 'Falha ao solicitar redefinição de senha' });
  }
};

// ---------- RESET PASSWORD (com token enviado por e-mail) ----------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'token e newPassword são obrigatórios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || 'reset_dev_key';

    let payload;
    try {
      payload = jwt.verify(token, resetSecret);
    } catch (e) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    if (payload.type !== 'password_reset') {
      return res.status(400).json({ error: 'Token inválido para redefinição de senha' });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: { password: hash },
      select: {
        id: true,
        email: true,
        photo: true,
        isPaid: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // opcional: já logar o usuário após reset
    const loginToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_dev_key',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Senha redefinida com sucesso',
      user,
      token: loginToken,
    });
  } catch (err) {
    console.error('Erro resetPassword:', err);
    return res.status(500).json({ error: 'Falha ao redefinir senha' });
  }
};

