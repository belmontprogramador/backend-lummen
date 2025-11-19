const router = require("express").Router();
const controller = require("./payments.controller");
const { requireApiKey } = require("../../../utils/apiAuth");
const { requireAuth } = require("../../../utils/authUser");

// Todas rotas de pagamento usam API KEY
router.use(requireApiKey);

// Webhook — não exige autenticação do usuário
router.post("/webhook", controller.webhook);

// Listar pagamentos do usuário logado
router.get("/", requireAuth, controller.listByUser);

// Criar pagamento manual (se quiser vender créditos)
router.post("/", requireAuth, controller.createPayment);

module.exports = router;
