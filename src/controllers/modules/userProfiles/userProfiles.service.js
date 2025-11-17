const repo = require("./userProfiles.repository");
const {
  extractBasic,
  extractLocation,
  extractLifestyle,
  extractWork,
  extractRelation,
  extractInterests,
  extractExtra,
} = require("./userProfiles.extractors");

const { prisma } = require("../../../dataBase/prisma");

const { translateProfileEnums } = require("../../../utils/enumTranslator");

console.log("repo ===>", repo);


module.exports = {

  
  async getProfile(userId, locale) {
    const sections = await repo.loadAll(userId);

    // juntar tudo num único objeto
    const merged = {
      ...sections.basic,
      ...sections.location,
      ...sections.lifestyle,
      ...sections.work,
      ...sections.relation,
      ...sections.interests,
      ...sections.extra,
    };

    return translateProfileEnums(merged, locale);
  },

  async updateProfile(userId, data, locale) {
    const parts = {
      basic: extractBasic(data),
      location: extractLocation(data),
      lifestyle: extractLifestyle(data),
      work: extractWork(data),
      relation: extractRelation(data),
      interests: extractInterests(data),
      extra: extractExtra(data),
    };

    await repo.upsertAll(userId, parts);

    return await this.getProfile(userId, locale);
  },

  async deleteProfile(userId) {
    // Você pode decidir se vai deletar tudo ou apenas marcar vazio
    return prisma.$transaction([
      prisma.userProfileBasic.delete({ where: { userId } }).catch(() => {}),
      prisma.userProfileLocation.delete({ where: { userId } }).catch(() => {}),
      prisma.userProfileLifestyle.delete({ where: { userId } }).catch(() => {}),
      prisma.userProfileWorkEducation.delete({ where: { userId } }).catch(() => {}),
      prisma.userProfileRelationInfo.delete({ where: { userId } }).catch(() => {}),
      prisma.userProfileInterests.delete({ where: { userId } }).catch(() => {}),
      prisma.userProfileExtra.delete({ where: { userId } }).catch(() => {}),
    ]);
  },

 async getEnums(locale) {
  console.log("📌 getEnums() recebeu locale:", locale);

  const rows = await prisma.enumLabel.findMany({ where: { locale } });

  return rows.reduce((acc, row) => {
    if (!acc[row.enumType]) acc[row.enumType] = [];
    acc[row.enumType].push({
      value: row.enumValue,
      label: row.label,
    });
    return acc;
  }, {});
}

};
