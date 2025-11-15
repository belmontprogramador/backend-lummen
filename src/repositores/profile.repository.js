const prisma = require("../config/prisma");

exports.listProfiles = (page, limit) => {
  const skip = (page - 1) * limit;
  return prisma.userProfile.findMany({
    skip,
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
};

exports.getProfile = (userId) => {
  return prisma.userProfile.findUnique({ where: { userId } });
};

exports.createProfile = (userId, data) => {
  return prisma.userProfile.create({
    data: { ...data, userId },
  });
};

exports.updateProfile = (userId, data) => {
  return prisma.userProfile.update({
    where: { userId },
    data,
  });
};

exports.deleteProfile = (userId) => {
  return prisma.userProfile.delete({
    where: { userId },
  });
};
