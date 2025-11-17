const { prisma } = require("../dataBase/prisma");


async function translateEnum(enumType, value, locale) {
  if (!value) return null;

  const entry = await prisma.enumLabel.findUnique({
    where: {
      enumType_enumValue_locale: {
        enumType,
        enumValue: value,
        locale
      }
    }
  });

  return {
    value,
    label: entry ? entry.label : value
  };
}

async function translateProfileEnums(profile, locale) {
  if (!profile) return null;

  const enumMap = {
    pronoun: "Pronoun",
    intention: "Intention",
    relationshipType: "RelationshipType",
    zodiac: "ZodiacSign",
    educationLevel: "EducationLevel",
    communication: "CommunicationStyle",
    pets: "PetsPreference",
    drinking: "DrinkingStatus",
    smoking: "SmokingStatus",
    activityLevel: "ActivityFrequency",
    orientation: "SexualOrientation"
  };

  const translated = { ...profile };

  for (const field in enumMap) {
    translated[field] = await translateEnum(enumMap[field], profile[field], locale);
  }

  return translated;
}

module.exports = { translateEnum, translateProfileEnums };
