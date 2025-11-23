const repo = require("./likes.repository");

module.exports = {
  async create(likerId, likedId, isSuper) {
    if (likerId === likedId)
      throw new Error("Você não pode curtir a si mesmo.");

    return repo.upsertLike(likerId, likedId, isSuper);
  },

  async remove(likerId, likedId) {
    return repo.deleteLike(likerId, likedId);
  },

  async check(likerId, likedId) {
    return repo.exists(likerId, likedId);
  },

  async received(userId) {
    return repo.getReceived(userId);
  },
};
