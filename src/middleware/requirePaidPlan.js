const dayjs = require("dayjs");
const { prisma } = require("../dataBase/prisma");

module.exports = function requirePaidPlan() {
  return async function (req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        console.log("🚫 [PAID] req.user sem ID");
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          isPaid: true,
          paidUntil: true,
        },
      });

      if (!user) return res.status(401).json({ error: "Unauthorized" });

      // 🔥 Nunca pagou
      if (!user.isPaid) {
        console.log(`⛔ [PAID] Usuário não pagante → ${userId}`);
        return res.status(402).json({
          error: "Payment required",
          code: "NOT_PAID",
        });
      }

      // 🔥 Assinatura expirada
      if (user.paidUntil && dayjs().isAfter(user.paidUntil)) {
        await prisma.user.update({
          where: { id: userId },
          data: { isPaid: false },
        });

        console.log(`⛔ [PAID] Assinatura expirada → ${userId}`);

        return res.status(402).json({
          error: "Subscription expired",
          code: "EXPIRED",
        });
      }

      console.log(`🟢 [PAID] Acesso permitido (pagamento OK)`);
      next();

    } catch (err) {
      console.log("🔥 [PAID] Erro interno:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
