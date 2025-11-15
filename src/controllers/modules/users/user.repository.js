// src/modules/users/user.repository.js
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  // ---------- FINDERS ----------
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByEmailForReset(email) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });
  },

  findOne(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
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

  createUserProfile(userId) {
    return prisma.userProfile.create({
      data: { userId }
    });
  },

  createUserPreference(userId) {
    return prisma.userPreference.create({
      data: {
        userId,
        maxDistanceKm: 50,
        ageMin: 18,
        ageMax: 99
      }
    });
  },

  createUserPhoto(userId, url) {
    return prisma.userPhoto.create({
      data: {
        userId,
        url,
        position: 1
      }
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

  // ---------- LIST / COUNT ----------
  list({ skip, limit, where }) {
    return prisma.user.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
        preference: true,
        photos: true
      }
    });
  },

  count(where) {
    return prisma.user.count({ where });
  },

  // ---------- UPDATES ----------
  updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        photo: true,
        isPaid: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
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

  updatePassword(id, newHash) {
  return prisma.user.update({
    where: { id },
    data: { password: newHash }
  });
},

  // ---------- DELETE ----------
  deleteUser(id) {
    return prisma.user.delete({ where: { id } });
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
      paidUntil: expirationDate,
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


findByIdBasic(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      password: true
    }
  });
},

findByEmailBasic(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true
    }
  });
},



};
