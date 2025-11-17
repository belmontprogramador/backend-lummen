const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  // ---------- FINDERS ----------
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByIdBasic(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true }
    });
  },

  // retorna o usuário completo
findOne(id) {
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
      payments: true,
      credits: true,
      boosts: true,
      likesSent: true,
      likesReceived: true
    }
  });
},

  // ---------- CREATE ----------
  createUser(data) {
    return prisma.user.create({ data });
  },

 createUserProfileBasic(userId) {
  return prisma.userProfileBasic.create({ data: { userId } });
},

createUserProfileLocation(userId) {
  return prisma.userProfileLocation.create({ data: { userId } });
},

createUserProfileLifestyle(userId) {
  return prisma.userProfileLifestyle.create({ data: { userId } });
},

createUserProfileWorkEducation(userId) {
  return prisma.userProfileWorkEducation.create({ data: { userId } });
},

createUserProfileRelationInfo(userId) {
  return prisma.userProfileRelationInfo.create({ data: { userId } });
},

createUserProfileInterests(userId) {
  return prisma.userProfileInterests.create({ data: { userId } });
},

createUserProfileExtra(userId) {
  return prisma.userProfileExtra.create({ data: { userId } });
},

  createUserPreference(userId) {
    return prisma.userPreference.create({
      data: {
         preferredGenders: [],
        userId,
        maxDistanceKm: 50,
        ageMin: 18,
        ageMax: 99
      }
    });
  },

  createUserPhoto(userId, url, position = 1) {
    return prisma.userPhoto.create({
      data: { userId, url, position }
    });
  },

  createPlaceholderPayment(userId) {
    return prisma.payment.create({
      data: {
        userId,
        amount: 0,
        currency: "USD",
        status: "PENDING"
      }
    });
  },

  createBoostCredit(userId) {
    return prisma.boostCredit.create({
      data: {
        userId,
        type: "BOOST",
        credits: 0,
        used: 0
      }
    });
  },

  createBoostActivation(userId, creditId) {
    return prisma.boostActivation.create({
      data: {
        userId,
        type: "BOOST",
        status: "PENDING",
        startsAt: new Date(),
        endsAt: new Date(),
        priority: 1,
        creditId
      }
    });
  },

  // ---------- LIST ----------
  list({ skip, limit, where }) {
  return prisma.user.findMany({
    skip,
    take: limit,
    where,
    orderBy: { createdAt: "desc" },
    include: {
      profileBasic: true,
      profileLocation: true,
      profileLifestyle: true,
      profileWork: true,
      profileRelation: true,
      profileInterests: true,
      profileExtra: true,
      photos: true,
    }
  });
},

  count(where) {
    return prisma.user.count({ where });
  },

  findUserBasic(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        photo: true,
        status: true,
        isPaid: true,
        paidUntil: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  // ---------- UPDATE ----------
  updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  updatePassword(id, newHash) {
    return prisma.user.update({
      where: { id },
      data: { password: newHash }
    });
  },

  updatePaid(email, expirationDate) {
    return prisma.user.update({
      where: { email },
      data: {
        isPaid: true,
        paidUntil: expirationDate
      },
      select: {
        id: true,
        email: true,
        isPaid: true,
        paidUntil: true,
        updatedAt: true
      }
    });
  },

  // ---------- DELETE ----------
  deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  }
};
