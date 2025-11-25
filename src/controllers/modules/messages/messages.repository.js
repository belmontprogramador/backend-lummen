const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  async findOrCreateConversation(userA, userB) {
    const [user1Id, user2Id] =
      userA < userB ? [userA, userB] : [userB, userA];

    let convo = await prisma.conversation.findFirst({
      where: { user1Id, user2Id },
    });

    if (!convo) {
      convo = await prisma.conversation.create({
        data: { user1Id, user2Id },
      });
    }

    return convo;
  },

 async createMessage(conversationId, senderId, text, imageUrl) {
  // descobrir quem é o outro usuário da conversa
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error("Conversa não encontrada.");
  }

  const toId = conversation.user1Id === senderId
    ? conversation.user2Id
    : conversation.user1Id;

  return prisma.message.create({
    data: {
      conversationId,
      fromId: senderId,
      toId,
      text: text || null,
      imageUrl: imageUrl || null,
    },
    include: {
      from: { select: { id: true, name: true, photo: true } },
    },
  });
},

async listMessages(conversationId) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      from: { select: { id: true, name: true, photo: true } },
    },
  });
}

};
