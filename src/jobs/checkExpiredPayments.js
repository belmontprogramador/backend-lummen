const dayjs = require('dayjs');
const { prisma } = require('../dataBase/prisma');

const checkExpiredPayments = async () => {
  try {
    const now = new Date();

    // Busca usuários pagos cuja validade expirou
    const expiredUsers = await prisma.user.findMany({
      where: {
        isPaid: true,
        paidUntil: { lt: now },
      },
    });

    if (expiredUsers.length === 0) {
      console.log('✅ Nenhum usuário expirado hoje.');
      return;
    }

    // Atualiza todos para isPaid = false
    const updates = expiredUsers.map((user) =>
      prisma.user.update({
        where: { id: user.id },
        data: { isPaid: false },
      })
    );

    await Promise.all(updates);

    console.log(`⚠️ ${expiredUsers.length} usuários foram desativados por expiração de pagamento.`);
  } catch (err) {
    console.error('❌ Erro ao verificar pagamentos expirados:', err.message);
  }
};

module.exports = checkExpiredPayments;
