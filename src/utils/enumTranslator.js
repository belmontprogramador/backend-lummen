const { prisma } = require("../dataBase/prisma");

// ========================
// TRADUZ STRING OU ARRAY
// ========================
async function translateEnumFlexible(enumType, value, locale) {
  if (!value) return value;

  // ✅ Se for ARRAY → reusa o tradutor de array
  if (Array.isArray(value)) {
    return translateEnumArray(enumType, value, locale);
  }

  // ✅ Se for STRING normal
  const entry = await prisma.enumLabel.findUnique({
    where: {
      enumType_enumValue_locale: {
        enumType,
        enumValue: value,
        locale,
      },
    },
  });

  return entry ? entry.label : value;
}

// ========================
// TRADUZ ARRAY DE ENUMS
// ========================
async function translateEnumArray(enumType, arr, locale) {
  if (!arr || !Array.isArray(arr)) return [];

  const rows = await prisma.enumLabel.findMany({
    where: { enumType, locale },
  });

  const map = rows.reduce((acc, row) => {
    acc[row.enumValue] = row.label;
    return acc;
  }, {});

  return arr.map((v) => map[v] || v);
}

// ========================
// ✅ TRADUÇÃO COMPLETA DO PROFILE
// ========================
async function translateProfileEnums(profile, locale) {
  if (!profile) return null;

  const result = { ...profile };

  // 🔹 BÁSICO
  result.gender = await translateEnumFlexible("Gender", profile.gender, locale);
  result.orientation = await translateEnumFlexible(
    "SexualOrientation",
    profile.orientation,
    locale
  );
  result.pronoun = await translateEnumFlexible(
    "Pronoun",
    profile.pronoun,
    locale
  );

  result.intention = await translateEnumFlexible(
    "Intention",
    profile.intention,
    locale
  );

  result.relationshipType = await translateEnumFlexible(
    "RelationshipType",
    profile.relationshipType,
    locale
  );

  result.zodiac = await translateEnumFlexible(
    "ZodiacSign",
    profile.zodiac,
    locale
  );

  // 🔹 LIFESTYLE
  result.pets = await translateEnumArray("PetsPreference", profile.pets, locale);
  result.smoking = await translateEnumArray(
    "SmokingStatus",
    profile.smoking,
    locale
  );
  result.drinking = await translateEnumArray(
    "DrinkingStatus",
    profile.drinking,
    locale
  );
  result.activityLevel = await translateEnumArray(
    "ActivityFrequency",
    profile.activityLevel,
    locale
  );
  result.communication = await translateEnumArray(
    "CommunicationStyle",
    profile.communication,
    locale
  );
  result.educationLevel = await translateEnumArray(
    "EducationLevel",
    profile.educationLevel,
    locale
  );

  // 🔹 IDIOMAS
  result.languages = await translateEnumArray(
    "Language",
    profile.languages,
    locale
  );

  // 🔹 INTERESSES
  result.interestsActivities = await translateEnumArray(
    "InterestActivity",
    profile.interestsActivities,
    locale
  );

  result.interestsLifestyle = await translateEnumArray(
    "InterestLifestyle",
    profile.interestsLifestyle,
    locale
  );

  result.interestsCreativity = await translateEnumArray(
    "InterestCreativity",
    profile.interestsCreativity,
    locale
  );

  result.interestsSportsFitness = await translateEnumArray(
    "InterestSports",
    profile.interestsSportsFitness,
    locale
  );

  result.interestsMusic = await translateEnumArray(
    "InterestMusic",
    profile.interestsMusic,
    locale
  );

  result.interestsNightlife = await translateEnumArray(
    "InterestNightlife",
    profile.interestsNightlife,
    locale
  );

  result.interestsTvCinema = await translateEnumArray(
    "InterestTvCinema",
    profile.interestsTvCinema,
    locale
  );

  return result;
}

// ========================
// ✅ TRADUÇÃO COMPLETA DAS PREFERÊNCIAS
// ========================
async function translatePreferenceEnums(preference, locale) {
  if (!preference) return null;

  const result = { ...preference };

  result.preferredGenders = await translateEnumArray(
    "Gender",
    preference.preferredGenders,
    locale
  );

  result.preferredOrientations = await translateEnumArray(
    "SexualOrientation",
    preference.preferredOrientations,
    locale
  );

  result.preferredPronouns = await translateEnumArray(
    "Pronoun",
    preference.preferredPronouns,
    locale
  );

  result.preferredIntentions = await translateEnumArray(
    "Intention",
    preference.preferredIntentions,
    locale
  );

  result.preferredRelationshipTypes = await translateEnumArray(
    "RelationshipType",
    preference.preferredRelationshipTypes,
    locale
  );

  result.preferredZodiacs = await translateEnumArray(
    "ZodiacSign",
    preference.preferredZodiacs,
    locale
  );

  result.preferredPets = await translateEnumArray(
    "PetsPreference",
    preference.preferredPets,
    locale
  );

  result.preferredSmoking = await translateEnumArray(
    "SmokingStatus",
    preference.preferredSmoking,
    locale
  );

  result.preferredDrinking = await translateEnumArray(
    "DrinkingStatus",
    preference.preferredDrinking,
    locale
  );

  result.preferredActivityLevel = await translateEnumArray(
    "ActivityFrequency",
    preference.preferredActivityLevel,
    locale
  );

  result.preferredCommunication = await translateEnumArray(
    "CommunicationStyle",
    preference.preferredCommunication,
    locale
  );

  result.preferredEducationLevels = await translateEnumArray(
    "EducationLevel",
    preference.preferredEducationLevels,
    locale
  );

  result.preferredLanguages = await translateEnumArray(
    "Language",
    preference.preferredLanguages,
    locale
  );

  result.preferredInterestsActivities = await translateEnumArray(
    "InterestActivity",
    preference.preferredInterestsActivities,
    locale
  );

  result.preferredInterestsLifestyle = await translateEnumArray(
    "InterestLifestyle",
    preference.preferredInterestsLifestyle,
    locale
  );

  result.preferredInterestsCreativity = await translateEnumArray(
    "InterestCreativity",
    preference.preferredInterestsCreativity,
    locale
  );

  result.preferredInterestsSportsFitness = await translateEnumArray(
    "InterestSports",
    preference.preferredInterestsSportsFitness,
    locale
  );

  result.preferredInterestsMusic = await translateEnumArray(
    "InterestMusic",
    preference.preferredInterestsMusic,
    locale
  );

  result.preferredInterestsNightlife = await translateEnumArray(
    "InterestNightlife",
    preference.preferredInterestsNightlife,
    locale
  );

  result.preferredInterestsTvCinema = await translateEnumArray(
    "InterestTvCinema",
    preference.preferredInterestsTvCinema,
    locale
  );

  return result;
}


module.exports = {
  translateEnumFlexible,
  translateEnumArray,
  translateProfileEnums,
  translatePreferenceEnums,
};
