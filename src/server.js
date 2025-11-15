const app = require("./app");
const cron = require('node-cron');
const checkExpiredPayments = require('./jobs/checkExpiredPayments');

const PORT = process.env.PORT || 3002;

// Rodar 1x por dia às 03:00 da manhã
cron.schedule('0 3 * * *', async () => {
  console.log('⏰ Iniciando verificação de pagamentos expirados...');
  await checkExpiredPayments();
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
