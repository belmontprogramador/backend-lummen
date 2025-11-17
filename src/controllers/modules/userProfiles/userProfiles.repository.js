const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  async upsertAll(userId, parts) {
    return prisma.$transaction([
      prisma.userProfileBasic.upsert({
        where: { userId },
        create: { userId, ...parts.basic },
        update: parts.basic,
      }),

      prisma.userProfileLocation.upsert({
        where: { userId },
        create: { userId, ...parts.location },
        update: parts.location,
      }),

      prisma.userProfileLifestyle.upsert({
        where: { userId },
        create: { userId, ...parts.lifestyle },
        update: parts.lifestyle,
      }),

      prisma.userProfileWorkEducation.upsert({
        where: { userId },
        create: { userId, ...parts.work },
        update: parts.work,
      }),

      prisma.userProfileRelationInfo.upsert({
        where: { userId },
        create: { userId, ...parts.relation },
        update: parts.relation,
      }),

      prisma.userProfileInterests.upsert({
        where: { userId },
        create: { userId, ...parts.interests },
        update: parts.interests,
      }),

      prisma.userProfileExtra.upsert({
        where: { userId },
        create: { userId, ...parts.extra },
        update: parts.extra,
      }),
    ]);
  },

  async loadAll(userId) {
    return {
      basic: await prisma.userProfileBasic.findUnique({ where: { userId } }),
      location: await prisma.userProfileLocation.findUnique({ where: { userId } }),
      lifestyle: await prisma.userProfileLifestyle.findUnique({ where: { userId } }),
      work: await prisma.userProfileWorkEducation.findUnique({ where: { userId } }),
      relation: await prisma.userProfileRelationInfo.findUnique({ where: { userId } }),
      interests: await prisma.userProfileInterests.findUnique({ where: { userId } }),
      extra: await prisma.userProfileExtra.findUnique({ where: { userId } }),
    };
  }
};
