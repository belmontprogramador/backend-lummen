const { prisma } = require("../../../dataBase/prisma");
const repo = require("./messages.repository");

// verifica se existe match
async function hasMatch(userId, otherId) {
  const likeA = await prisma.like.findUnique({
    where: { likerId_likedId: { likerId: userId, likedId: otherId } },
  });

  const likeB = await prisma.like.findUnique({
    where: { likerId_likedId: { likerId: otherId, likedId: userId } },
  });

  return !!likeA && !!likeB;
}

module.exports = {
  async sendMessage(fromUserId, toUserId, text, imageUrl) {
    if (!text && !imageUrl) {
      throw new Error("Mensagem vazia.");
    }

    const match = await hasMatch(fromUserId, toUserId);
    if (!match) {
      throw new Error("Você só pode enviar mensagens para matches.");
    }

    // cria ou pega conversa
    const conversation = await repo.findOrCreateConversation(
      fromUserId,
      toUserId
    );

    const message = await repo.createMessage(
      conversation.id,
      fromUserId,
      text,
      imageUrl
    );

    return { conversationId: conversation.id, message };
  },

  async listConversation(userId, otherUserId) {
    const match = await hasMatch(userId, otherUserId);
    if (!match) {
      throw new Error("Você não tem permissão para ver essa conversa.");
    }

    // conversa sempre existe após match
    const conversation = await repo.findOrCreateConversation(
      userId,
      otherUserId
    );

    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, photo: true },
    });

    const messages = await repo.listMessages(conversation.id);

    return {
      conversationId: conversation.id,
      user: otherUser,
      messages,
    };
  },
};
