const dayjs = require("dayjs");
const { prisma } = require("../dataBase/prisma");

module.exports = async function paymentAutoExpire(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return next();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPaid: true, paidUntil: true }
    });

    if (!user) return next();

    // Sem prazo → nunca foi pago
    if (!user.paidUntil) {
      if (user.isPaid) {
        await prisma.user.update({
          where: { id: userId },
          data: { isPaid: false }
        });
      }
      return next();
    }

    const expired = dayjs().isAfter(user.paidUntil);

    if (expired && user.isPaid) {
      // ❌ Pagamento expirado → desativa automaticamente
      await prisma.user.update({
        where: { id: userId },
        data: { isPaid: false }
      });
    }

    next();
  } catch (e) {
    console.log("⚠ erro paymentAutoExpire:", e);
    next();
  }
};
