const dayjs = require("dayjs");
const repo = require("./payments.repository");
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  // WEBHOOK DE PAGAMENTO
  async handleWebhook({ email, days, plan }) {
    console.log("🔵 [WEBHOOK] Dados recebidos:", { email, days, plan });

    if (!email || !days || !plan)
      throw new Error("email, days e plan são obrigatórios");

    // -----------------------------------------------------
    // 1️⃣ Buscar usuário
    // -----------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("🟣 [WEBHOOK] Usuário encontrado:", user);

    if (!user) throw new Error("Usuário não encontrado");

    // -----------------------------------------------------
    // 2️⃣ Buscar ID do plano na tabela Plan
    // -----------------------------------------------------
    const planRecord = await prisma.plan.findUnique({
      where: { name: plan }, // ex: PREMIUM_1
    });

    if (!planRecord) {
      throw new Error(`Plano ${plan} não existe no banco`);
    }

    console.log("🔶 [WEBHOOK] Plano encontrado:", planRecord);

    const expiration = dayjs().add(Number(days), "day").toDate();

    // -----------------------------------------------------
    // 3️⃣ Atualizar usuário com planId, isPaid e paidUntil
    // -----------------------------------------------------
    console.log("🟤 [WEBHOOK] Atualizando usuário...");
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        planId: planRecord.id,
        paidUntil: expiration,
        isPaid: true,
      },
    });

    console.log("🟢 [WEBHOOK] Plano atualizado:", updatedUser);

    // -----------------------------------------------------
    // 4️⃣ Criar registro de pagamento
    // -----------------------------------------------------
    const payment = await repo.create({
      userId: user.id,
      amount: planRecord.price,
      currency: "USD",
      status: "PAID",
      expiresAt: expiration,
      plan: plan, // opcional, só para histórico
    });

    return {
      success: true,
      message: `Pagamento confirmado`,
      payment,
    };
  },

  async listByUser(userId) {
    return repo.findByUser(userId);
  },

  async createPayment(userId, { amount, currency = "USD" }) {
    if (!amount) throw new Error("amount é obrigatório");

    return repo.create({
      userId,
      amount,
      currency,
      status: "PENDING",
    });
  },
};
