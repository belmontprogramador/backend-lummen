const { prisma } = require("../dataBase/prisma");

// Traduz apenas 1 enum
async function translateEnum(enumType, value, locale) {
  if (!value) return null;

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

// Traduz array de enums
async function translateEnumArray(enumType, arr, locale) {
  if (!arr || !Array.isArray(arr)) return [];

  const translated = [];

  for (const value of arr) {
    const entry = await prisma.enumLabel.findUnique({
      where: {
        enumType_enumValue_locale: {
          enumType,
          enumValue: value,
          locale,
        },
      },
    });

    translated.push(entry ? entry.label : value);
  }

  return translated;
}

// -----------------------
// Traduz UserProfile COMPLETO
// -----------------------
async function translateProfileEnums(profile, locale) {
  if (!profile) return null;

  const result = { ...profile };

  // ENUMS SIMPLES
  result.gender = await translateEnum("Gender", profile.gender, locale);
  result.orientation = await translateEnum("SexualOrientation", profile.orientation, locale);
  result.pronoun = await translateEnum("Pronoun", profile.pronoun, locale);

  // ARRAY — CORRIGIDO para UserProfile real
  result.preferredLanguages = await translateEnumArray("Language", profile.preferredLanguages, locale);
  result.preferredZodiacs = await translateEnumArray("ZodiacSign", profile.preferredZodiacs, locale);

  result.preferredPets = await translateEnumArray("PetsPreference", profile.preferredPets, locale);
  result.preferredSmoking = await translateEnumArray("SmokingStatus", profile.preferredSmoking, locale);
  result.preferredDrinking = await translateEnumArray("DrinkingStatus", profile.preferredDrinking, locale);
  result.preferredActivityLevel = await translateEnumArray("ActivityFrequency", profile.preferredActivityLevel, locale);
  result.preferredCommunication = await translateEnumArray("CommunicationStyle", profile.preferredCommunication, locale);

  result.preferredEducationLevels = await translateEnumArray("EducationLevel", profile.preferredEducationLevels, locale);

  // INTERESSES — 100% CORRIGIDOS
  result.preferredInterestsActivities = await translateEnumArray("InterestActivity", profile.preferredInterestsActivities, locale);
  result.preferredInterestsLifestyle = await translateEnumArray("InterestLifestyle", profile.preferredInterestsLifestyle, locale);
  result.preferredInterestsCreativity = await translateEnumArray("InterestCreativity", profile.preferredInterestsCreativity, locale);
  result.preferredInterestsSportsFitness = await translateEnumArray("InterestSports", profile.preferredInterestsSportsFitness, locale);
  result.preferredInterestsMusic = await translateEnumArray("InterestMusic", profile.preferredInterestsMusic, locale);
  result.preferredInterestsNightlife = await translateEnumArray("InterestNightlife", profile.preferredInterestsNightlife, locale);
  result.preferredInterestsTvCinema = await translateEnumArray("InterestTvCinema", profile.preferredInterestsTvCinema, locale);

  return result;
}

module.exports = {
  translateEnum,
  translateEnumArray,
  translateProfileEnums,
};
