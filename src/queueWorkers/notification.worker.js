module.exports = async (job) => {
  const { userId, title, body } = job.data;

  console.log("📲 ENVIANDO NOTIFICAÇÃO PARA:", userId);

  // Exemplo real:
  // await pushService.sendPush(userId, title, body);

  return { delivered: true };
};
