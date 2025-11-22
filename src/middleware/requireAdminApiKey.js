const crypto = require("crypto");

function parseKeys(envName) {
  return (process.env[envName] || "")
    .split(",")
    .map(k => k.trim())
    .filter(Boolean);
}

function safeEqual(a, b) {
  try {
    const A = Buffer.from(String(a || ""));
    const B = Buffer.from(String(b || ""));
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
  } catch {
    return false;
  }
}

function requireAdminApiKey(req, res, next) {
  const keys = parseKeys("ADMIN_API_TOKENS");

  if (!keys.length) {
    console.log("❌ ADMIN_API_TOKENS não configurado!");
    return res.status(500).json({ error: "ADMIN_API_TOKENS não configurado" });
  }

  const candidate =
    req.get("x-api-key") ||
    req.get("authorization")?.replace(/^ApiKey /i, "") ||
    req.query.api_key;

  if (!candidate || !keys.some(k => safeEqual(k, candidate))) {
    console.log("🚫 Painel API KEY inválida ->", candidate);
    return res.status(401).json({ error: "Unauthorized (painel key inválida)" });
  }

  next();
}

module.exports = { requireAdminApiKey };
