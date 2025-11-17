// src/modules/users/user.service.js
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const repository = require("./user.repository");
const profileRepo = require("./profile.repository");


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

module.exports = {
  // REGISTER
async register(payload, file) {
  console.log("🟦 [REGISTER] Payload recebido:", payload);
  console.log("🟦 [REGISTER] File recebido:", file);

  let { email, password, isPaid, status, name } = payload;

  if (!email || !password) {
    console.log("❌ [REGISTER] Faltando email ou senha");
    throw new Error("email e password são obrigatórios");
  }

  if (!file) {
    console.log("❌ [REGISTER] Foto não enviada");
    throw new Error("photo é obrigatória");
  }

  email = normalizeEmail(email);

  const exists = await repository.findByEmail(email);
  if (exists) {
    console.log("❌ [REGISTER] Email já cadastrado:", email);
    throw new Error("E-mail já cadastrado");
  }

  console.log("🟦 Hashing senha...");
  const hash = await bcrypt.hash(password, 10);
  const photoPath = toPublicPath(file);

  console.log("🟦 Criando USER...");
  const user = await repository.createUser({
    email,
    password: hash,
    isPaid: Boolean(isPaid),
    status: status || undefined,
    photo: photoPath,
    name: name || "",
  });

  console.log("🟩 USER criado:", user.id);

  // --- PERFIS NOVOS ---
  console.log("🟦 Criando perfis do usuário…");
  await profileRepo.createBasic(user.id);
  await profileRepo.createLocation(user.id);
  await profileRepo.createLifestyle(user.id);
  await profileRepo.createWork(user.id);
  await profileRepo.createRelation(user.id);
  await profileRepo.createInterests(user.id);
  await profileRepo.createExtra(user.id);
  console.log("🟩 Perfis criados");

  console.log("🟦 Criando preferências…");
  await repository.createUserPreference(user.id);

  console.log("🟦 Criando créditos…");
  const credit = await repository.createBoostCredit(user.id);

  console.log("🟦 Ativando créditos…");
  await repository.createBoostActivation(user.id, credit.id);

  console.log("🟦 Criando pagamento placeholder…");
  await repository.createPlaceholderPayment(user.id);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: "7d" }
  );

  console.log("🟩 Usuário criado com sucesso, retornando token.");

  const fullUser = await repository.findOne(user.id);
  return { user: fullUser, token };
},

  // LOGIN
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

    const fullUser = await repository.findOne(user.id);
    return { user: fullUser, token };
  },

  // LIST
  async list(query, loggedUserId) {
    const page = Math.max(parseInt(query.page || "1"), 1);
    const limit = Math.max(parseInt(query.limit || "20"), 1);
    const skip = (page - 1) * limit;

    const q = (query.q || "").trim().toLowerCase();
    const where = q ? { email: { contains: q } } : {};
    where.id = { not: loggedUserId };

    const [total, items] = await Promise.all([
      repository.count(where),
      repository.list({ skip, limit, where }),
    ]);

    return { page, limit, total, pages: Math.ceil(total / limit), items };
  },

  // UPDATE
  async update(id, data, file) {
    const USER_FIELDS = ["email", "name", "password", "status", "isPaid", "paidUntil"];
    const userData = {};

    for (const key in data) {
      if (USER_FIELDS.includes(key)) userData[key] = data[key];
    }

    if (file) userData.photo = toPublicPath(file);

    if (Object.keys(userData).length > 0) {
      await repository.updateUser(id, userData);
    }

    return await repository.findUserBasic(id);
  },

  // REMOVE
  async remove(id) {
    const user = await repository.findOne(id);
    if (!user) throw new Error("Usuário não encontrado");

    removeLocalFile(user.photo);
    await repository.deleteUser(id);
    return true;
  },

  // GET ONE
  async getOne(id) {
    const user = await repository.findOne(id);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  },

  // PAGAMENTOS
  async setPaidWebhook({ email, days }) {
    if (!email || !days) throw new Error("email e days são obrigatórios");

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

  // UPDATE PASSWORD
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

  // CHANGE PASSWORD
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
  },
};
