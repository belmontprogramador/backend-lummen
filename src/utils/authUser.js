// src/utils/auth.js
const jwt = require("jsonwebtoken");
const checkSubscription = require("../middleware/checkSubscription");

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verifica token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_dev_key"
    );

    // Injeta o usuário no req
    req.user = { id: payload.id, email: payload.email };

    // 🔥 Middleware de expiração automática da assinatura
    await checkSubscription(req, res, () => {});

    // Continua para a rota normalmente
    return next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
