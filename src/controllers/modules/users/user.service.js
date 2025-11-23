const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { normalizeUserPayload } = require("../../../utils/normalizeUserPayload");


const repository = require("./user.repository");

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

  // =====================================================================
  // REGISTER
  // =====================================================================
  async register(payload, file) {
    let { email, password, isPaid, status, name, planId } = payload;

    if (!email || !password) throw new Error("email e password são obrigatórios");
    if (!file) throw new Error("photo é obrigatória");

    email = normalizeEmail(email);

    const exists = await repository.findByEmail(email);
    if (exists) throw new Error("E-mail já cadastrado");

    const hash = await bcrypt.hash(password, 10);
    const photoPath = toPublicPath(file);

    // Plano FREE
    if (!planId) {
      const freePlan = await repository.findPlanByName("free");
      planId = freePlan.id;
    }

    // Criar usuário
    const user = await repository.createUser({
      email,
      password: hash,
      photo: photoPath,
      name: name || "",
      isPaid: Boolean(isPaid),
      status,
      planId,
    });

    // Criar o perfil UNIFICADO
    await repository.createUserProfile(user.id);

    // Criar preferências padrão
    await repository.createUserPreference(user.id);

    // Boost + Créditos
    const credit = await repository.createBoostCredit(user.id);
    await repository.createBoostActivation(user.id, credit.id);

    // Pagamento placeholder
    await repository.createPlaceholderPayment(user.id);

    const fullUser = await repository.findOne(user.id);

    const token = jwt.sign(
      {
        id: fullUser.id,
        email: fullUser.email,
        isPaid: fullUser.isPaid,
        paidUntil: fullUser.paidUntil,
        planId: fullUser.planId
      },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    return { user: normalizeUserPayload(fullUser), token };

  },

  // =====================================================================
  // LOGIN
  // =====================================================================
  async login(email, password) {
    email = normalizeEmail(email);

    const user = await repository.findByEmail(email);
    if (!user) throw new Error("Credenciais inválidas");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Credenciais inválidas");

    const now = new Date();
    const expired = user.paidUntil && new Date(user.paidUntil) < now;

    if (expired && user.isPaid) {
      const freePlan = await repository.findPlanByName("free");

      await repository.updateUser(user.id, {
        isPaid: false,
        paidUntil: null,
        planId: freePlan.id,
      });
    }

    const fullUser = await repository.findOne(user.id);

    const token = jwt.sign(
      {
        id: fullUser.id,
        email: fullUser.email,
        isPaid: fullUser.isPaid,
        paidUntil: fullUser.paidUntil,
        planId: fullUser.planId
      },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    return { user: normalizeUserPayload(fullUser), token };

  },

  // =====================================================================
  // LIST USERS
  // =====================================================================
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

  // =====================================================================
  // UPDATE USER
  // =====================================================================
  async update(id, data, file) {
    const FIELDS = ["email", "name", "password", "status", "isPaid", "paidUntil"];
    const userData = {};

    for (const key in data) {
      if (FIELDS.includes(key)) userData[key] = data[key];
    }

    if (file) userData.photo = toPublicPath(file);

    if (Object.keys(userData).length > 0)
      await repository.updateUser(id, userData);

    return await repository.findUserBasic(id);
  },

  // =====================================================================
  // REMOVE
  // =====================================================================
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

  async me(userId) {
    return await repository.findOne(userId);
  },

  // =====================================================================
  // UPDATE PASSWORD
  // =====================================================================
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
