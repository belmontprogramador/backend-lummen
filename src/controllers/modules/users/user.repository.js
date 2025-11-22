const { prisma } = require("../../../dataBase/prisma");

module.exports = {

  // -------------------------------------------------------------------
  // FINDERS
  // -------------------------------------------------------------------

findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          title: true,
          price: true,
          durationDays: true,
          allowedRoutes: true,
          routePayment: true
        }
      }
    }
  });
},

  findByIdBasic(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true }
    });
  },

  findOne(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            durationDays: true,
            allowedRoutes: true,
            routePayment: true
          }
        },

        // 🔥 Novo perfil unificado
        profile: true,

        // 🔹 Preferências
        preference: true,

        // 🔹 Outros relacionamentos
        photos: true,
        payments: true,
        credits: true,
        boosts: true,
        likesSent: true,
        likesReceived: true,
      }
    });
  },

  findPlanByName(name) {
    return prisma.plan.findFirst({
      where: { name }
    });
  },

  // -------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------

  createUser(data) {
    return prisma.user.create({
      data,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            durationDays: true,
            allowedRoutes: true,
            routePayment: true
          }
        }
      }
    });
  },

  updateUserPlan(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            durationDays: true,
            allowedRoutes: true,
            routePayment: true
          }
        }
      }
    });
  },

  // 🔥 Novo: criação de perfil unificado
  createUserProfile(userId) {
    return prisma.userProfile.create({
      data: { userId }
    });
  },

  createUserPreference(userId) {
    return prisma.userPreference.create({
      data: {
        userId,
        preferredGenders: [],
        preferredOrientations: [],
        preferredPronouns: [],
        preferredZodiacs: [],
        preferredIntentions: [],
        preferredRelationshipTypes: [],
        preferredPets: [],
        preferredSmoking: [],
        preferredDrinking: [],
        preferredActivityLevel: [],
        preferredCommunication: [],
        preferredEducationLevels: [],
        preferredLanguages: [],
        preferredInterestsActivities: [],
        preferredInterestsLifestyle: [],
        preferredInterestsCreativity: [],
        preferredInterestsSportsFitness: [],
        preferredInterestsMusic: [],
        preferredInterestsNightlife: [],
        preferredInterestsTvCinema: [],
        maxDistanceKm: 50,
        ageMin: 18,
        ageMax: 99,
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

  // -------------------------------------------------------------------
  // LIST
  // -------------------------------------------------------------------

  list({ skip, limit, where }) {
    return prisma.user.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            durationDays: true,
            allowedRoutes: true,
            routePayment: true
          }
        },

        profile: true,
        photos: true
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
        planId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  // -------------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------------

  updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            durationDays: true,
            allowedRoutes: true,
            routePayment: true
          }
        }
      }
    });
  },

  updatePassword(id, newHash) {
    return prisma.user.update({
      where: { id },
      data: { password: newHash }
    });
  },

  // -------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------

  deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  }
};
