const { prisma } = require("../dataBase/prisma");

module.exports = function requirePlanRoute(routeName) {
  return async function (req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { plan: true }
      });

      if (!user || !user.plan) {
        return res.status(403).json({
          error: "User has no plan",
          code: "NO_PLAN"
        });
      }

      const allowed = user.plan.allowedRoutes || [];

      // VIP/ULTRA podem ter "*"
      if (allowed.includes("*") || allowed.includes(routeName)) {
        return next();
      }

      return res.status(403).json({
        error: "Plan does not allow access",
        code: "NOT_ALLOWED",
        route: routeName,
        plan: user.plan.name
      });

    } catch (e) {
      console.log("erro requirePlanRoute:", e);
      res.status(500).json({ error: "Internal error" });
    }
  };
};
