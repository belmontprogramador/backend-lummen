const repo = require("./userProfiles.repository");
const axios = require("axios");
const { prisma } = require("../../../dataBase/prisma");
const { translateProfileEnums } = require("../../../utils/enumTranslator");
const { precalculateCompatibility } = require("../../../jobs/precalculateCompatibility");
const precalcState = require("../../../jobs/state/precalcState");


// ======================
// GEO CODE (CITY -> LAT/LNG)
// ======================
async function geocodeLocation({ city, state, country }) {
  try {
    const text = [city, state, country].filter(Boolean).join(", ");
    if (!text) return null;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      text
    )}&apiKey=${process.env.GEOAPIFY_KEY}`;

    const res = await axios.get(url);

    if (!res.data.features?.length) return null;

    const { lat, lon } = res.data.features[0].properties;
    return { latitude: lat, longitude: lon };
  } catch (err) {
    console.log("❌ Erro no geocode:", err);
    return null;
  }
}

// ======================
// REVERSE GEO CODE (LAT/LNG -> CITY/STATE/COUNTRY)
// ======================
async function reverseGeocode(latitude, longitude) {
  if (!latitude || !longitude) return {};

  try {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.GEOAPIFY_KEY}`;
    const res = await axios.get(url);

    const props = res.data.features?.[0]?.properties || {};

    return {
      city: props.city || props.town || props.village || null,
      state: props.state || null,
      country: props.country || null,
    };
  } catch (err) {
    console.log("❌ Erro no reverse geocode:", err);
    return {};
  }
}

// ======================
// CALCULAR IDADE (APENAS NA RESPOSTA)
// ======================
function calcAge(birthday) {
  if (!birthday) return null;

  const birth = new Date(birthday);
  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();

  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() &&
      now.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

// ======================
// SANITIZE CAMPOS
// ======================
function sanitizeUserProfileData(data) {
  if (!data || typeof data !== "object") return {};
  return { ...data };
}


// ======================
// NORMALIZA LABEL -> ENUM VALUE
// ======================
async function normalizeEnumArrayBackToValue(enumType, arr) {
  if (!Array.isArray(arr)) return [];

  const rows = await prisma.enumLabel.findMany({
    where: { enumType },
  });

  const map = rows.reduce((acc, row) => {
    acc[row.label] = row.enumValue;
    acc[row.enumValue] = row.enumValue;
    return acc;
  }, {});

  return arr.map((v) => map[v] || v);
}

// ======================
// SERVICE
// ======================
module.exports = {
  async getProfile(userId, locale) {
    const profile = await repo.getProfile(userId);
    if (!profile) return null;

    // Tradução dos enums
    const translated = await translateProfileEnums(profile, locale);

    // Reverse geocode
    const geo = await reverseGeocode(
      profile.latitude,
      profile.longitude
    );

    // Idade calculada
    const age = calcAge(profile.birthday);

    return {
      ...translated,
      ...geo,
      age,
    };
  },

 // ======================
// UPDATE FREE
// ======================
async updateProfileFree(userId, data, locale) {
  const filtered = sanitizeUserProfileData(data);

  if (filtered.birthday) {
    filtered.birthday = new Date(filtered.birthday);
  }

  if (data.latitude && data.longitude) {
    const geo = await reverseGeocode(data.latitude, data.longitude);
    filtered.latitude = data.latitude;
    filtered.longitude = data.longitude;
    filtered.city = geo.city;
    filtered.state = geo.state;
    filtered.country = geo.country;
  }

  if (data.city || data.state || data.country) {
    const coords = await geocodeLocation(data);
    if (coords) {
      filtered.latitude = coords.latitude;
      filtered.longitude = coords.longitude;
    }

    filtered.city = data.city || null;
    filtered.state = data.state || null;
    filtered.country = data.country || null;
  }

  // 🔥 Salva perfil
  await repo.upsertProfile(userId, filtered);

  // 🔥 RECÁLCULO AUTOMÁTICO – SEM BLOQUEAR A REQUISIÇÃO
  if (!precalcState.isRunning(userId)) {
    console.log("⚡ Iniciando recálculo (FREE) para:", userId);
    precalcState.start(userId);

    precalculateCompatibility(userId)
      .finally(() => {
        precalcState.stop(userId);
        console.log("✅ Recálculo finalizado:", userId);
      });
  }

  return this.getProfile(userId, locale);
},

 // ======================
// UPDATE PREMIUM
// ======================
async updateProfilePremium(userId, data, locale) {
  const filtered = sanitizeUserProfileData(data);

  if (filtered.birthday) {
    filtered.birthday = new Date(filtered.birthday);
  }

  if (filtered.gender)
    filtered.gender = await normalizeEnumArrayBackToValue("Gender", filtered.gender);

  if (filtered.orientation)
    filtered.orientation = await normalizeEnumArrayBackToValue("SexualOrientation", filtered.orientation);

  if (filtered.pronoun)
    filtered.pronoun = await normalizeEnumArrayBackToValue("Pronoun", filtered.pronoun);

  if (filtered.intention)
    filtered.intention = await normalizeEnumArrayBackToValue("Intention", filtered.intention);

  if (filtered.relationshipType)
    filtered.relationshipType = await normalizeEnumArrayBackToValue("RelationshipType", filtered.relationshipType);

  if (filtered.zodiac)
    filtered.zodiac = await normalizeEnumArrayBackToValue("ZodiacSign", filtered.zodiac);

  if (filtered.pets)
    filtered.pets = await normalizeEnumArrayBackToValue("PetsPreference", filtered.pets);

  if (filtered.smoking)
    filtered.smoking = await normalizeEnumArrayBackToValue("SmokingStatus", filtered.smoking);

  if (filtered.drinking)
    filtered.drinking = await normalizeEnumArrayBackToValue("DrinkingStatus", filtered.drinking);

  if (filtered.activityLevel)
    filtered.activityLevel = await normalizeEnumArrayBackToValue("ActivityFrequency", filtered.activityLevel);

  if (filtered.communication)
    filtered.communication = await normalizeEnumArrayBackToValue("CommunicationStyle", filtered.communication);

  if (filtered.educationLevel)
    filtered.educationLevel = await normalizeEnumArrayBackToValue("EducationLevel", filtered.educationLevel);

  if (filtered.languages)
    filtered.languages = await normalizeEnumArrayBackToValue("Language", filtered.languages);

  if (filtered.interestsActivities)
    filtered.interestsActivities = await normalizeEnumArrayBackToValue("InterestActivity", filtered.interestsActivities);

  if (filtered.interestsLifestyle)
    filtered.interestsLifestyle = await normalizeEnumArrayBackToValue("InterestLifestyle", filtered.interestsLifestyle);

  if (filtered.interestsCreativity)
    filtered.interestsCreativity = await normalizeEnumArrayBackToValue("InterestCreativity", filtered.interestsCreativity);

  if (filtered.interestsSportsFitness)
    filtered.interestsSportsFitness = await normalizeEnumArrayBackToValue("InterestSports", filtered.interestsSportsFitness);

  if (filtered.interestsMusic)
    filtered.interestsMusic = await normalizeEnumArrayBackToValue("InterestMusic", filtered.interestsMusic);

  if (filtered.interestsNightlife)
    filtered.interestsNightlife = await normalizeEnumArrayBackToValue("InterestNightlife", filtered.interestsNightlife);

  if (filtered.interestsTvCinema)
    filtered.interestsTvCinema = await normalizeEnumArrayBackToValue("InterestTvCinema", filtered.interestsTvCinema);

  // Location updates
  if (data.latitude && data.longitude) {
    const geo = await reverseGeocode(data.latitude, data.longitude);
    filtered.latitude = data.latitude;
    filtered.longitude = data.longitude;
    filtered.city = geo.city;
    filtered.state = geo.state;
    filtered.country = geo.country;
  }

  if (data.city || data.state || data.country) {
    const coords = await geocodeLocation(data);
    if (coords) {
      filtered.latitude = coords.latitude;
      filtered.longitude = coords.longitude;
    }

    filtered.city = data.city || null;
    filtered.state = data.state || null;
    filtered.country = data.country || null;
  }

  // 🔥 Salva perfil
  await repo.upsertProfile(userId, filtered);

  // 🔥 RECÁLCULO AUTOMÁTICO APÓS ATUALIZAÇÃO PREMIUM
  if (!precalcState.isRunning(userId)) {
    console.log("⚡ Iniciando recálculo (PREMIUM) para:", userId);
    precalcState.start(userId);

    precalculateCompatibility(userId)
      .finally(() => {
        precalcState.stop(userId);
        console.log("✅ Recálculo finalizado:", userId);
      });
  }

  return this.getProfile(userId, locale);
},


  async deleteProfile(userId) {
    return repo.deleteProfile(userId);
  },

  async getEnums(locale) {
    const rows = await prisma.enumLabel.findMany({
      where: { locale },
    });

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
