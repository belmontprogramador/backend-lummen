const { prisma } = require("../dataBase/prisma");

module.exports = async function checkSubscription(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return next();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isPaid: true,
        paidUntil: true,
        planId: true
      }
    });

    if (!user) return next();

    const now = new Date();
    const expired = user.paidUntil && new Date(user.paidUntil) < now;

    if (expired) {
      console.log(`⚠ Assinatura expirada: usuário ${user.id}`);

      // Buscar plano FREE
      const freePlan = await prisma.plan.findUnique({
        where: { name: "free" }
      });

      if (freePlan) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPaid: false,
            paidUntil: null,
            planId: freePlan.id
          }
        });

        // Refletir na request atual
        req.user.isPaid = false;
        req.user.paidUntil = null;
        req.user.planId = freePlan.id;
      }
    }

    return next();

  } catch (err) {
    console.error("Erro no checkSubscription:", err);
    return next();
  }
};
