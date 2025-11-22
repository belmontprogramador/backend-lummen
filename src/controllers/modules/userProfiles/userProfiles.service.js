const repo = require("./userProfiles.repository");
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
    return { latitude: lat, longitude: lon };
  } catch (err) {
    console.log("❌ Erro no geocode:", err);
    return null;
  }
}

// 🔹 Filtra dinamicamente apenas os campos existentes na tabela UserProfile
function sanitizeUserProfileData(data) {
  const validFields = Object.keys(prisma.userProfile.fields);
  const result = {};
  for (const key of Object.keys(data)) {
    if (validFields.includes(key)) {
      result[key] = data[key];
    }
  }
  return result;
}

module.exports = {
  async getProfile(userId, locale) {
    const profile = await repo.getProfile(userId);
    if (!profile) return null;
    return translateProfileEnums(profile, locale);
  },

  async updateProfileFree(userId, data, locale) {
    // ✅ Mantém apenas campos válidos da model
    const filtered = sanitizeUserProfileData(data);

    if (data.city || data.state || data.country) {
      const coords = await geocodeLocation(data);
      if (coords) Object.assign(filtered, coords);
    }

    await repo.upsertProfile(userId, filtered);
    return this.getProfile(userId, locale);
  },

  async updateProfilePremium(userId, data, locale) {
    const filtered = sanitizeUserProfileData(data);

    if (data.city || data.state || data.country) {
      const coords = await geocodeLocation(data);
      if (coords) Object.assign(filtered, coords);
    }

    await repo.upsertProfile(userId, filtered);
    return this.getProfile(userId, locale);
  },

  async deleteProfile(userId) {
    return repo.deleteProfile(userId);
  },

  async getEnums(locale) {
    console.log("📌 getEnums() recebeu locale:", locale);
    const rows = await prisma.enumLabel.findMany({ where: { locale } });

    return rows.reduce((acc, row) => {
      if (!acc[row.enumType]) acc[row.enumType] = [];
      acc[row.enumType].push({ value: row.enumValue, label: row.label });
      return acc;
    }, {});
  },
};
