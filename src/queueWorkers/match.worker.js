module.exports = async (job) => {
  const { user1, user2 } = job.data;

  console.log("❤️ PROCESSANDO MATCH ENTRE:", user1, user2);

  // Exemplo de lógica real:
  // await matchService.createMatch(user1, user2);

  return { status: "match_created" };
};
