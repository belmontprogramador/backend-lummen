const { prisma } = require("../dataBase/prisma");

// -----------------------
// Traduz apenas 1 enum
// -----------------------
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

// -----------------------
// Traduz ARRAY de enums
// -----------------------
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
// Traduz objeto completo
// -----------------------
async function translateProfileEnums(profile, locale) {
  if (!profile) return null;

  // ------- ENUMS SIMPLES -------
  const enumMap = {
    gender: "Gender",
    orientation: "SexualOrientation",
    pronoun: "Pronoun",
    zodiac: "ZodiacSign",
    intention: "Intention",
    relationshipType: "RelationshipType",
    educationLevel: "EducationLevel",
    communication: "CommunicationStyle",
    pets: "PetsPreference",
    drinking: "DrinkingStatus",
    smoking: "SmokingStatus",
    activityLevel: "ActivityFrequency",
  };

  // ------- ENUMS EM ARRAY -------
  const enumArrayMap = {
    languages: "Language",                      // OK
    interestsActivities: "InterestActivity",    // CORRIGIDO
    interestsLifestyle: "InterestLifestyle",    // CORRIGIDO
    interestsCreativity: "InterestCreativity",  // CORRIGIDO
    interestsSportsFitness: "InterestSports",   // CORRIGIDO
    interestsMusic: "InterestMusic",            // CORRIGIDO
    interestsNightlife: "InterestNightlife",    // CORRIGIDO
    interestsTvCinema: "InterestTvCinema",      // CORRIGIDO
  };

  const result = { ...profile };

  // Traduz enums simples
  for (const field in enumMap) {
    result[field] = await translateEnum(enumMap[field], profile[field], locale);
  }

  // Traduz arrays de enums
  for (const field in enumArrayMap) {
    result[field] = await translateEnumArray(
      enumArrayMap[field],
      profile[field],
      locale
    );
  }

  return result;
}

module.exports = {
  translateEnum,
  translateEnumArray,
  translateProfileEnums,
};
