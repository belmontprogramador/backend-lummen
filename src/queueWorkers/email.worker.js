module.exports = async (job) => {
  const { to, subject, message } = job.data;

  console.log("📧 PROCESSANDO EMAIL:");
  console.log({ to, subject, message });

  // Exemplo real → aqui você usa seu serviço de envio de email
  // await emailService.send(to, subject, message);

  return { status: "sent" };
};
