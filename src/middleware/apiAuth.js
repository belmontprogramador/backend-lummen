const crypto = require('crypto');

function parseKeys() {
  return (process.env.API_TOKENS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function safeEqual(a, b) {
  try {
    const A = Buffer.from(String(a || ''));
    const B = Buffer.from(String(b || ''));
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
  } catch {
    return false;
  }
}

function requireApiKey(req, res, next) {
  const keys = parseKeys();

  if (!keys.length) {
    console.log("❌ ERRO: API_TOKENS não configurado no backend!");
    return res.status(500).json({ error: 'API_TOKENS não configurado' });
  }

  const hApiKey = req.get('x-api-key');
  const hAuth = req.get('authorization'); // "ApiKey <chave>"
  const qKey = req.query?.api_key;

  let candidate = hApiKey;
  if (!candidate && hAuth) {
    const [scheme, value] = String(hAuth).split(' ');
    if (scheme?.toLowerCase() === 'apikey') candidate = value;
  }
  if (!candidate && qKey) candidate = qKey;

  const ok = keys.some(k => safeEqual(k, candidate));

  if (!ok) {
    console.log("🚫 API KEY NÃO AUTORIZADA");
    console.log("🔑 Chave recebida:", candidate || "(nenhuma)");
    console.log("🔐 Primeiras chaves configuradas:", keys.slice(0, 2)); // não mostra tudo
    console.log("📍 Rota acessada:", req.originalUrl);

    return res.status(401).json({ 
      error: 'Unauthorized (API key inválida)' 
    });
  }

  // marca como validado
  req.apiKeyValidated = true;
  next();
}

module.exports = { requireApiKey };
