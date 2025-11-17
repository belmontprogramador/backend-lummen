const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  createBasic(userId) {
    return prisma.userProfileBasic.create({ data: { userId } });
  },

  createLocation(userId) {
    return prisma.userProfileLocation.create({ data: { userId } });
  },

  createLifestyle(userId) {
    return prisma.userProfileLifestyle.create({ data: { userId } });
  },

  createWork(userId) {
    return prisma.userProfileWorkEducation.create({ data: { userId } });
  },

  createRelation(userId) {
    return prisma.userProfileRelationInfo.create({ data: { userId } });
  },

  createInterests(userId) {
    return prisma.userProfileInterests.create({ data: { userId } });
  },

  createExtra(userId) {
    return prisma.userProfileExtra.create({ data: { userId } });
  }
};
