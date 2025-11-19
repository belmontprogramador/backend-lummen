// src/middleware/dynamicRoute.js
const { prisma } = require("../dataBase/prisma");

module.exports = function dynamicRoute(routeTag) {
  return async function (req, res, next) {
    try {
      // 1) Buscar rota pelo tag (somente para verificar se existe)
      const route = await prisma.route.findUnique({
        where: { tag: routeTag },
      });

      if (!route) {
        return res.status(404).json({
          error: "Route not found",
          code: "ROUTE_NOT_FOUND",
        });
      }

      // 2) Usuário precisa ter plano carregado no req.user
      const plan = req.user.plan;
      if (!plan) {
        console.log("❌ Usuário sem plano");
        return res.status(403).json({ error: "Plano obrigatório" });
      }

      const allowed = plan.allowedRoutes || [];
      const paymentMap = plan.routePayment || {};

      // 3) Verificar se a rota está permitida no plano
      if (!allowed.includes(routeTag)) {
        console.log("❌ Rota não permitida no plano:", routeTag);
        return res.status(403).json({ error: "Acesso não permitido" });
      }

      // 4) Verificar se a rota é paga dentro do plano
      const isPaidRoute = Boolean(paymentMap[routeTag]);

      if (isPaidRoute) {
        if (!req.user.isPaid || !req.user.paidUntil) {
          console.log("❌ Rota paga mas usuário sem assinatura:", routeTag);
          return res.status(402).json({
            error: "Rota paga — assinatura necessária",
          });
        }
      }

      // 5) Autorizado
      return next();

    } catch (err) {
      console.log("🔥 Erro dynamicRoute:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
