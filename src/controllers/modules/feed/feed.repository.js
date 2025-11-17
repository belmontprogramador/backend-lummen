const { prisma } = require("../../../dataBase/prisma");

module.exports = {

 getById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      profileBasic: true,
      profileLocation: true,
      profileLifestyle: true,
      profileWork: true,
      profileRelation: true,
      profileInterests: true,
      profileExtra: true,

      preference: true,
      photos: true,

      credits: true,   // <--- BoostCredit[]
      boosts: true,    // <--- BoostActivation[]

      likesSent: true,
      likesReceived: true,
    }
  });
},

  list({ skip, limit, where, loggedUserId }) {
    return prisma.user.findMany({
      skip,
      take: limit,
      where: {
        ...where,
        id: { not: loggedUserId },
      },
      include: {
        profileBasic: true,
        profileLocation: true,
        profileLifestyle: true,
        profileWork: true,
        profileRelation: true,
        profileInterests: true,
        profileExtra: true,
        photos: true,
        preference: true
      },
    });
  },

  count(where) {
    return prisma.user.count({ where });
  },
};
