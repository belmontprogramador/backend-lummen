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
const axios = require("axios");
const { prisma } = require("../../../dataBase/prisma");
const { translateProfileEnums } = require("../../../utils/enumTranslator");


async function geocodeLocation({ city, state, country }) {
  try {
    const text = [city, state, country].filter(Boolean).join(", ");
    if (!text) return null;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      text
    )}&apiKey=${process.env.GEOAPIFY_KEY}`;

    const res = await axios.get(url);
    const data = res.data;

    if (!data.features?.length) return null;

    const { lat, lon } = data.features[0].properties;

    return {
      latitude: lat,
      longitude: lon,
    };
  } catch (err) {
    console.log("❌ Erro no geocode:", err);
    return null;
  }
}


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

  // -----------------------------
  // 🌍 GEOLOCALIZAÇÃO AUTOMÁTICA
  // -----------------------------
  const loc = parts.location;

  if (loc.city || loc.state || loc.country) {
    const coords = await geocodeLocation(loc);

    if (coords) {
      loc.latitude = coords.latitude;
      loc.longitude = coords.longitude;
    }
  }

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
