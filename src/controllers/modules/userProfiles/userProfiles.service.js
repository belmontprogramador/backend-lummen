// src/modules/userProfiles/userProfiles.service.js

const repo = require("./userProfiles.repository");
const axios = require("axios");
const { prisma } = require("../../../dataBase/prisma");
const { translateProfileEnums } = require("../../../utils/enumTranslator");

// quais campos o FREE pode mexer
const FREE_FIELDS = [
  "bio",
  "birthday",
  "gender",
  "orientation",
  "pronoun",
  "city",
  "state",
  "country",
  "languages",
];

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

// pega só campos FREE do body
function filterFreeData(data) {
  const result = {};
  for (const key of FREE_FIELDS) {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  }
  return result;
}

module.exports = {
  // 🔹 GET /me
  async getProfile(userId, locale) {
    const profile = await repo.getProfile(userId);

    if (!profile) return null;

    // traduz enums (Gender, Orientation, etc.)
    return translateProfileEnums(profile, locale);
  },

  // 🔹 UPDATE FREE
  async updateProfileFree(userId, data, locale) {
    // só campos que o free pode mexer
    const filtered = filterFreeData(data);

    // geocode se veio localização
    if (filtered.city || filtered.state || filtered.country) {
      const coords = await geocodeLocation(filtered);
      if (coords) {
        filtered.latitude = coords.latitude;
        filtered.longitude = coords.longitude;
      }
    }

    await repo.upsertProfile(userId, filtered);

    return this.getProfile(userId, locale);
  },

  // 🔹 UPDATE PREMIUM
  async updateProfilePremium(userId, data, locale) {
    // aqui você aceita o objeto completo que o app mandar,
    // desde que os campos existam no model UserProfile

    const toSave = { ...data };

    // geocode se veio localização
    if (toSave.city || toSave.state || toSave.country) {
      const coords = await geocodeLocation(toSave);
      if (coords) {
        toSave.latitude = coords.latitude;
        toSave.longitude = coords.longitude;
      }
    }

    await repo.upsertProfile(userId, toSave);

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
      acc[row.enumType].push({
        value: row.enumValue,
        label: row.label,
      });
      return acc;
    }, {});
  },
};
