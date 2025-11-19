const { prisma } = require("../dataBase/prisma");

module.exports = function requireRouteAccess(routeName) {
  return async function (req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        console.log("🚫 [ROUTE] req.user sem ID");
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          plan: { select: { name: true, allowedRoutes: true } },
        },
      });

      if (!user || !user.plan) {
        console.log(`❌ [ROUTE] Usuário sem plano configurado`);
        return res.status(403).json({
          error: "Plan not assigned",
          code: "NO_PLAN",
        });
      }

      const routes = user.plan.allowedRoutes || [];

      // 🔥 Se o plano não libera e não usa "*"
      if (!routes.includes("*") && !routes.includes(routeName)) {
        console.log(`⛔ [ROUTE] Acesso NEGADO → ${routeName}`);
        console.log(`Plano: ${user.plan.name}`);
        console.log(`Rotas liberadas:`, routes);

        return res.status(403).json({
          error: "Route not allowed by plan",
          code: "NOT_ALLOWED",
          route: routeName,
        });
      }

      console.log(`🟢 [ROUTE] Rota liberada: ${routeName}`);
      next();

    } catch (err) {
      console.log("🔥 [ROUTE] Erro interno:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
