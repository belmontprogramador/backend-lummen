const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      console.log("🚫 [AUTH] Falha: Token ausente");
      console.log("📍 Rota acessada:", req.originalUrl);
      return res.status(401).json({ error: 'Token ausente' });
    }

    let payload = null;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("🚫 [AUTH] Token inválido ou expirado");
      console.log("🔑 Token recebido:", token.substring(0, 15) + "... (ocultado)");
      console.log("📍 Rota acessada:", req.originalUrl);
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Token válido → injeta user
    req.user = payload; // { id, email, role }

    console.log("🟢 [AUTH] Token válido");
    console.log("👤 Usuário ID:", payload.id);
    console.log("🛂 Papel:", payload.role);

    next();

  } catch (e) {
    console.log("🔥 [AUTH] Erro inesperado:", e);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};


exports.requireRole = (...roles) => (req, res, next) => {
  const user = req.user;

  if (!user) {
    console.log("🚫 [ROLE] Falha: req.user não está definido (auth não rodou?)");
    console.log("📍 Rota acessada:", req.originalUrl);
    return res.status(403).json({ error: 'Sem permissão' });
  }

  if (!roles.includes(user.role)) {
    console.log("🚫 [ROLE] Acesso negado por papel insuficiente");
    console.log("👤 Usuário ID:", user.id);
    console.log("🛂 Papel atual:", user.role);
    console.log("🔐 Papéis necessários:", roles);
    console.log("📍 Rota acessada:", req.originalUrl);

    return res.status(403).json({ error: 'Sem permissão' });
  }

  console.log("🟢 [ROLE] Permissão concedida ao usuário:", user.id);
  next();
};
