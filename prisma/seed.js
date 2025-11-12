const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Inserindo traduções multilíngues para todos os enums...');

  const data = [
    // 🧍 Pronoun
    { enumType: 'Pronoun', enumValue: 'HE_HIM', locale: 'en', label: 'He/Him' },
    { enumType: 'Pronoun', enumValue: 'HE_HIM', locale: 'pt', label: 'Ele/Dele' },
    { enumType: 'Pronoun', enumValue: 'HE_HIM', locale: 'es', label: 'Él/De él' },

    { enumType: 'Pronoun', enumValue: 'SHE_HER', locale: 'en', label: 'She/Her' },
    { enumType: 'Pronoun', enumValue: 'SHE_HER', locale: 'pt', label: 'Ela/Dela' },
    { enumType: 'Pronoun', enumValue: 'SHE_HER', locale: 'es', label: 'Ella/De ella' },

    { enumType: 'Pronoun', enumValue: 'THEY_THEM', locale: 'en', label: 'They/Them' },
    { enumType: 'Pronoun', enumValue: 'THEY_THEM', locale: 'pt', label: 'Elu/Delu' },
    { enumType: 'Pronoun', enumValue: 'THEY_THEM', locale: 'es', label: 'Elle' },

    { enumType: 'Pronoun', enumValue: 'OTHER', locale: 'en', label: 'Other' },
    { enumType: 'Pronoun', enumValue: 'OTHER', locale: 'pt', label: 'Outro' },
    { enumType: 'Pronoun', enumValue: 'OTHER', locale: 'es', label: 'Otro' },

    // ❤️ Intention
    { enumType: 'Intention', enumValue: 'FRIENDS', locale: 'en', label: 'Friends' },
    { enumType: 'Intention', enumValue: 'FRIENDS', locale: 'pt', label: 'Amizade' },
    { enumType: 'Intention', enumValue: 'FRIENDS', locale: 'es', label: 'Amistad' },

    { enumType: 'Intention', enumValue: 'DATING', locale: 'en', label: 'Dating' },
    { enumType: 'Intention', enumValue: 'DATING', locale: 'pt', label: 'Namoro' },
    { enumType: 'Intention', enumValue: 'DATING', locale: 'es', label: 'Citas' },

    { enumType: 'Intention', enumValue: 'LONG_TERM', locale: 'en', label: 'Long-term relationship' },
    { enumType: 'Intention', enumValue: 'LONG_TERM', locale: 'pt', label: 'Relacionamento sério' },
    { enumType: 'Intention', enumValue: 'LONG_TERM', locale: 'es', label: 'Relación seria' },

    { enumType: 'Intention', enumValue: 'CASUAL', locale: 'en', label: 'Casual' },
    { enumType: 'Intention', enumValue: 'CASUAL', locale: 'pt', label: 'Casual' },
    { enumType: 'Intention', enumValue: 'CASUAL', locale: 'es', label: 'Casual' },

    { enumType: 'Intention', enumValue: 'NETWORKING', locale: 'en', label: 'Networking' },
    { enumType: 'Intention', enumValue: 'NETWORKING', locale: 'pt', label: 'Networking' },
    { enumType: 'Intention', enumValue: 'NETWORKING', locale: 'es', label: 'Red de contactos' },

    { enumType: 'Intention', enumValue: 'OTHER', locale: 'en', label: 'Other' },
    { enumType: 'Intention', enumValue: 'OTHER', locale: 'pt', label: 'Outro' },
    { enumType: 'Intention', enumValue: 'OTHER', locale: 'es', label: 'Otro' },

    // 💞 RelationshipType
    { enumType: 'RelationshipType', enumValue: 'MONOGAMY', locale: 'en', label: 'Monogamy' },
    { enumType: 'RelationshipType', enumValue: 'MONOGAMY', locale: 'pt', label: 'Monogamia' },
    { enumType: 'RelationshipType', enumValue: 'MONOGAMY', locale: 'es', label: 'Monogamia' },

    { enumType: 'RelationshipType', enumValue: 'NON_MONOGAMY', locale: 'en', label: 'Non-monogamy' },
    { enumType: 'RelationshipType', enumValue: 'NON_MONOGAMY', locale: 'pt', label: 'Não monogamia' },
    { enumType: 'RelationshipType', enumValue: 'NON_MONOGAMY', locale: 'es', label: 'No monogamia' },

    { enumType: 'RelationshipType', enumValue: 'OPEN', locale: 'en', label: 'Open relationship' },
    { enumType: 'RelationshipType', enumValue: 'OPEN', locale: 'pt', label: 'Relacionamento aberto' },
    { enumType: 'RelationshipType', enumValue: 'OPEN', locale: 'es', label: 'Relación abierta' },

    { enumType: 'RelationshipType', enumValue: 'OTHER', locale: 'en', label: 'Other' },
    { enumType: 'RelationshipType', enumValue: 'OTHER', locale: 'pt', label: 'Outro' },
    { enumType: 'RelationshipType', enumValue: 'OTHER', locale: 'es', label: 'Otro' },

    // 🎓 EducationLevel
    { enumType: 'EducationLevel', enumValue: 'HIGH_SCHOOL', locale: 'en', label: 'High School' },
    { enumType: 'EducationLevel', enumValue: 'HIGH_SCHOOL', locale: 'pt', label: 'Ensino médio' },
    { enumType: 'EducationLevel', enumValue: 'HIGH_SCHOOL', locale: 'es', label: 'Secundaria' },

    { enumType: 'EducationLevel', enumValue: 'BACHELOR', locale: 'en', label: 'Bachelor’s degree' },
    { enumType: 'EducationLevel', enumValue: 'BACHELOR', locale: 'pt', label: 'Graduação' },
    { enumType: 'EducationLevel', enumValue: 'BACHELOR', locale: 'es', label: 'Licenciatura' },

    { enumType: 'EducationLevel', enumValue: 'MASTER', locale: 'en', label: 'Master’s degree' },
    { enumType: 'EducationLevel', enumValue: 'MASTER', locale: 'pt', label: 'Mestrado' },
    { enumType: 'EducationLevel', enumValue: 'MASTER', locale: 'es', label: 'Maestría' },

    { enumType: 'EducationLevel', enumValue: 'PHD', locale: 'en', label: 'PhD / Doctorate' },
    { enumType: 'EducationLevel', enumValue: 'PHD', locale: 'pt', label: 'Doutorado' },
    { enumType: 'EducationLevel', enumValue: 'PHD', locale: 'es', label: 'Doctorado' },

    { enumType: 'EducationLevel', enumValue: 'OTHER', locale: 'en', label: 'Other' },
    { enumType: 'EducationLevel', enumValue: 'OTHER', locale: 'pt', label: 'Outro' },
    { enumType: 'EducationLevel', enumValue: 'OTHER', locale: 'es', label: 'Otro' },

    // 🚬 SmokingStatus
    { enumType: 'SmokingStatus', enumValue: 'NO', locale: 'en', label: 'No' },
    { enumType: 'SmokingStatus', enumValue: 'NO', locale: 'pt', label: 'Não' },
    { enumType: 'SmokingStatus', enumValue: 'NO', locale: 'es', label: 'No' },

    { enumType: 'SmokingStatus', enumValue: 'SOCIALLY', locale: 'en', label: 'Socially' },
    { enumType: 'SmokingStatus', enumValue: 'SOCIALLY', locale: 'pt', label: 'Socialmente' },
    { enumType: 'SmokingStatus', enumValue: 'SOCIALLY', locale: 'es', label: 'Socialmente' },

    { enumType: 'SmokingStatus', enumValue: 'YES', locale: 'en', label: 'Yes' },
    { enumType: 'SmokingStatus', enumValue: 'YES', locale: 'pt', label: 'Sim' },
    { enumType: 'SmokingStatus', enumValue: 'YES', locale: 'es', label: 'Sí' },

    // 🍷 DrinkingStatus
    { enumType: 'DrinkingStatus', enumValue: 'NO', locale: 'en', label: 'No' },
    { enumType: 'DrinkingStatus', enumValue: 'NO', locale: 'pt', label: 'Não' },
    { enumType: 'DrinkingStatus', enumValue: 'NO', locale: 'es', label: 'No' },

    { enumType: 'DrinkingStatus', enumValue: 'SOCIALLY', locale: 'en', label: 'Socially' },
    { enumType: 'DrinkingStatus', enumValue: 'SOCIALLY', locale: 'pt', label: 'Socialmente' },
    { enumType: 'DrinkingStatus', enumValue: 'SOCIALLY', locale: 'es', label: 'Socialmente' },

    { enumType: 'DrinkingStatus', enumValue: 'YES', locale: 'en', label: 'Yes' },
    { enumType: 'DrinkingStatus', enumValue: 'YES', locale: 'pt', label: 'Sim' },
    { enumType: 'DrinkingStatus', enumValue: 'YES', locale: 'es', label: 'Sí' },

    // ⚽ ActivityFrequency
    { enumType: 'ActivityFrequency', enumValue: 'LOW', locale: 'en', label: 'Low' },
    { enumType: 'ActivityFrequency', enumValue: 'LOW', locale: 'pt', label: 'Baixa' },
    { enumType: 'ActivityFrequency', enumValue: 'LOW', locale: 'es', label: 'Baja' },

    { enumType: 'ActivityFrequency', enumValue: 'MEDIUM', locale: 'en', label: 'Medium' },
    { enumType: 'ActivityFrequency', enumValue: 'MEDIUM', locale: 'pt', label: 'Média' },
    { enumType: 'ActivityFrequency', enumValue: 'MEDIUM', locale: 'es', label: 'Media' },

    { enumType: 'ActivityFrequency', enumValue: 'HIGH', locale: 'en', label: 'High' },
    { enumType: 'ActivityFrequency', enumValue: 'HIGH', locale: 'pt', label: 'Alta' },
    { enumType: 'ActivityFrequency', enumValue: 'HIGH', locale: 'es', label: 'Alta' },

    // 🐶 PetsPreference
    { enumType: 'PetsPreference', enumValue: 'NONE', locale: 'en', label: 'None' },
    { enumType: 'PetsPreference', enumValue: 'NONE', locale: 'pt', label: 'Nenhum' },
    { enumType: 'PetsPreference', enumValue: 'NONE', locale: 'es', label: 'Ninguno' },

    { enumType: 'PetsPreference', enumValue: 'DOG', locale: 'en', label: 'Dog' },
    { enumType: 'PetsPreference', enumValue: 'DOG', locale: 'pt', label: 'Cachorro' },
    { enumType: 'PetsPreference', enumValue: 'DOG', locale: 'es', label: 'Perro' },

    { enumType: 'PetsPreference', enumValue: 'CAT', locale: 'en', label: 'Cat' },
    { enumType: 'PetsPreference', enumValue: 'CAT', locale: 'pt', label: 'Gato' },
    { enumType: 'PetsPreference', enumValue: 'CAT', locale: 'es', label: 'Gato' },

    { enumType: 'PetsPreference', enumValue: 'DOG_AND_CAT', locale: 'en', label: 'Dog and Cat' },
    { enumType: 'PetsPreference', enumValue: 'DOG_AND_CAT', locale: 'pt', label: 'Cachorro e gato' },
    { enumType: 'PetsPreference', enumValue: 'DOG_AND_CAT', locale: 'es', label: 'Perro y gato' },

    { enumType: 'PetsPreference', enumValue: 'OTHER', locale: 'en', label: 'Other' },
    { enumType: 'PetsPreference', enumValue: 'OTHER', locale: 'pt', label: 'Outro' },
    { enumType: 'PetsPreference', enumValue: 'OTHER', locale: 'es', label: 'Otro' },

    // 💬 CommunicationStyle
    { enumType: 'CommunicationStyle', enumValue: 'DIRECT', locale: 'en', label: 'Direct' },
    { enumType: 'CommunicationStyle', enumValue: 'DIRECT', locale: 'pt', label: 'Direto' },
    { enumType: 'CommunicationStyle', enumValue: 'DIRECT', locale: 'es', label: 'Directo' },

    { enumType: 'CommunicationStyle', enumValue: 'HUMOR', locale: 'en', label: 'Humorous' },
    { enumType: 'CommunicationStyle', enumValue: 'HUMOR', locale: 'pt', label: 'Bem-humorado' },
    { enumType: 'CommunicationStyle', enumValue: 'HUMOR', locale: 'es', label: 'Humorístico' },

    { enumType: 'CommunicationStyle', enumValue: 'EMPATHETIC', locale: 'en', label: 'Empathetic' },
    { enumType: 'CommunicationStyle', enumValue: 'EMPATHETIC', locale: 'pt', label: 'Empático' },
    { enumType: 'CommunicationStyle', enumValue: 'EMPATHETIC', locale: 'es', label: 'Empático' },

    { enumType: 'CommunicationStyle', enumValue: 'ANALYTICAL', locale: 'en', label: 'Analytical' },
    { enumType: 'CommunicationStyle', enumValue: 'ANALYTICAL', locale: 'pt', label: 'Analítico' },
    { enumType: 'CommunicationStyle', enumValue: 'ANALYTICAL', locale: 'es', label: 'Analítico' },

    // ♈ ZodiacSign (simplificado)
    { enumType: 'ZodiacSign', enumValue: 'ARIES', locale: 'en', label: 'Aries' },
    { enumType: 'ZodiacSign', enumValue: 'ARIES', locale: 'pt', label: 'Áries' },
    { enumType: 'ZodiacSign', enumValue: 'ARIES', locale: 'es', label: 'Aries' },
    // … (adicione os demais signos até PISCES)

    // 🌈 SexualOrientation
    { enumType: 'SexualOrientation', enumValue: 'STRAIGHT', locale: 'en', label: 'Straight' },
    { enumType: 'SexualOrientation', enumValue: 'STRAIGHT', locale: 'pt', label: 'Heterossexual' },
    { enumType: 'SexualOrientation', enumValue: 'STRAIGHT', locale: 'es', label: 'Heterosexual' },

    { enumType: 'SexualOrientation', enumValue: 'GAY', locale: 'en', label: 'Gay' },
    { enumType: 'SexualOrientation', enumValue: 'GAY', locale: 'pt', label: 'Gay' },
    { enumType: 'SexualOrientation', enumValue: 'GAY', locale: 'es', label: 'Gay' },
  ];

  await prisma.enumLabel.createMany({ data, skipDuplicates: true });
  console.log(`✅ ${data.length} traduções inseridas!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
