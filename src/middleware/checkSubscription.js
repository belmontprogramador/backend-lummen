// src/middleware/checkSubscription.js
const { prisma } = require("../dataBase/prisma");

module.exports = async function checkSubscription(req, res, next) {
  try {
    // Se não existe usuário autenticado, continua
    if (!req.user?.id) return next();

    // Buscar informações necessárias do usuário
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        isPaid: true,
        paidUntil: true
      }
    });

    // Se o usuário não tem assinatura, apenas segue
    if (!user || !user.paidUntil) return next();

    const now = new Date();
    const expiration = new Date(user.paidUntil);

    // Se expirou → só atualiza o banco. Não bloqueia nada.
    if (expiration < now && user.isPaid === true) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isPaid: false }
      });

      console.log(`🔔 Assinatura expirada → usuário ${user.id} marcado como isPaid = false`);
    }

    return next();

  } catch (err) {
    console.error("Erro no checkSubscription:", err);
    return next(); // nunca bloqueia a rota
  }
};
