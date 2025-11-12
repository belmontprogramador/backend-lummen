const { prisma } = require('../../dataBase/prisma');

exports.likeUser = async (req, res) => {
  try {
    const { likerId, likedId } = req.body;
    if (likerId === likedId) return res.status(400).json({ error: "Você não pode curtir a si mesmo!" });

    await prisma.like.create({ data: { likerId, likedId } });

    // Verifica se há match
    const match = await prisma.like.findFirst({
      where: { likerId: likedId, likedId: likerId },
    });

    if (match) {
      return res.json({ match: true, message: "🔥 É um match!" });
    }

    res.json({ match: false, message: "Curtida registrada." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
