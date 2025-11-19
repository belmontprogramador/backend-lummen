const dayjs = require("dayjs");
const { prisma } = require("../dataBase/prisma");

// middleware dinâmico:
// requirePaidUser()  → apenas verifica se é pago
// requirePaidUser("PREMIUM_1") → exige plano mínimo
// requirePaidUser("VIP") → exige plano VIP pra cima
module.exports = function requirePaidUser(minPlanName = null) {
  return async function (req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          isPaid: true,
          paidUntil: true,
          planId: true,
          plan: { select: { name: true } }
        }
      });

      if (!user) return res.status(401).json({ error: "Unauthorized" });

      // ============================================================
      // 1️⃣ Expirou → desativa e bloqueia
      // ============================================================
      if (user.paidUntil && dayjs().isAfter(user.paidUntil)) {
        await prisma.user.update({
          where: { id: userId },
          data: { isPaid: false }
        });

        return res.status(402).json({
          error: "Subscription expired",
          code: "EXPIRED"
        });
      }

      // ============================================================
      // 2️⃣ Nunca pagou → bloqueia
      // ============================================================
      if (!user.isPaid) {
        return res.status(402).json({
          error: "Payment required",
          code: "NOT_PAID"
        });
      }

      // ============================================================
      // 3️⃣ Não tem plano configurado → erro interno
      // ============================================================
      if (!user.planId || !user.plan) {
        return res.status(500).json({
          error: "User has no plan assigned",
          code: "NO_PLAN_CONFIGURED"
        });
      }

      // ============================================================
      // 4️⃣ Verificação de plano mínimo (dinâmico)
      // ============================================================
      if (minPlanName) {
        const currentPlan = user.plan.name;

        // ranking dos planos
        const ORDER = ["FREE", "PREMIUM_1", "PREMIUM_2", "VIP", "ULTRA"];

        const currentRank = ORDER.indexOf(currentPlan);
        const requiredRank = ORDER.indexOf(minPlanName);

        if (currentRank < requiredRank) {
          return res.status(403).json({
            error: "Insufficient plan level",
            code: "PLAN_DENIED",
            required: minPlanName,
            current: currentPlan
          });
        }
      }

      // tudo OK → libera
      next();

    } catch (e) {
      console.log("⚠ erro requirePaidUser:", e);
      res.status(500).json({ error: "Internal error" });
    }
  };
};
