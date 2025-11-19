// src/middleware/authUser.js
const jwt = require("jsonwebtoken");
const { prisma } = require("../dataBase/prisma");
const checkSubscription = require("./checkSubscription");

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      console.log("🚫 [AUTH] Token ausente");
      return res.status(401).json({ error: "Token ausente" });
    }

    let payload = null;

    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret_dev_key"
      );
    } catch (err) {
      console.log("🚫 [AUTH] Token inválido");
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // 🔥 BUSCAR USUÁRIO COMPLETO DO BANCO
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        plan: true, // 👈 AQUI!! CARREGA allowedRoutes e routePayment
      },
    });

    if (!user) {
      console.log("🚫 Usuário não existe");
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.user = user;

    await checkSubscription(req, res, () => {});

    return next();
  } catch (err) {
    console.log("🔥 [AUTH] ERRO:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
