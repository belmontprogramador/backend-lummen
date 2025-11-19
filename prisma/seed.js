const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Inserindo traduções multilíngues para TODOS os ENUMS...");

  const data = [
    // ---------------------------------------------------------
    // 🧑‍💼 Role
    // ---------------------------------------------------------
    { enumType: 'Role', enumValue: 'SUPER', locale: 'en', label: 'Super Admin' },
    { enumType: 'Role', enumValue: 'SUPER', locale: 'pt', label: 'Super Admin' },
    { enumType: 'Role', enumValue: 'SUPER', locale: 'es', label: 'Super Admin' },

    { enumType: 'Role', enumValue: 'ADMIN', locale: 'en', label: 'Administrator' },
    { enumType: 'Role', enumValue: 'ADMIN', locale: 'pt', label: 'Administrador' },
    { enumType: 'Role', enumValue: 'ADMIN', locale: 'es', label: 'Administrador' },

    // ---------------------------------------------------------
    // 👤 UserStatus
    // ---------------------------------------------------------
    { enumType: 'UserStatus', enumValue: 'ACTIVE', locale: 'en', label: 'Active' },
    { enumType: 'UserStatus', enumValue: 'ACTIVE', locale: 'pt', label: 'Ativo' },
    { enumType: 'UserStatus', enumValue: 'ACTIVE', locale: 'es', label: 'Activo' },

    { enumType: 'UserStatus', enumValue: 'INACTIVE', locale: 'en', label: 'Inactive' },
    { enumType: 'UserStatus', enumValue: 'INACTIVE', locale: 'pt', label: 'Inativo' },
    { enumType: 'UserStatus', enumValue: 'INACTIVE', locale: 'es', label: 'Inactivo' },

    { enumType: 'UserStatus', enumValue: 'SUSPENDED', locale: 'en', label: 'Suspended' },
    { enumType: 'UserStatus', enumValue: 'SUSPENDED', locale: 'pt', label: 'Suspenso' },
    { enumType: 'UserStatus', enumValue: 'SUSPENDED', locale: 'es', label: 'Suspendido' },

    // ---------------------------------------------------------
    // 💳 PaymentStatus
    // ---------------------------------------------------------
    { enumType: 'PaymentStatus', enumValue: 'PENDING', locale: 'en', label: 'Pending' },
    { enumType: 'PaymentStatus', enumValue: 'PENDING', locale: 'pt', label: 'Pendente' },
    { enumType: 'PaymentStatus', enumValue: 'PENDING', locale: 'es', label: 'Pendiente' },

    { enumType: 'PaymentStatus', enumValue: 'PAID', locale: 'en', label: 'Paid' },
    { enumType: 'PaymentStatus', enumValue: 'PAID', locale: 'pt', label: 'Pago' },
    { enumType: 'PaymentStatus', enumValue: 'PAID', locale: 'es', label: 'Pagado' },

    { enumType: 'PaymentStatus', enumValue: 'EXPIRED', locale: 'en', label: 'Expired' },
    { enumType: 'PaymentStatus', enumValue: 'EXPIRED', locale: 'pt', label: 'Expirado' },
    { enumType: 'PaymentStatus', enumValue: 'EXPIRED', locale: 'es', label: 'Expirado' },

    { enumType: 'PaymentStatus', enumValue: 'CANCELED', locale: 'en', label: 'Canceled' },
    { enumType: 'PaymentStatus', enumValue: 'CANCELED', locale: 'pt', label: 'Cancelado' },
    { enumType: 'PaymentStatus', enumValue: 'CANCELED', locale: 'es', label: 'Cancelado' },

    // ---------------------------------------------------------
    // 🚀 BoostType
    // ---------------------------------------------------------
    { enumType: 'BoostType', enumValue: 'BOOST', locale: 'en', label: 'Boost' },
    { enumType: 'BoostType', enumValue: 'BOOST', locale: 'pt', label: 'Impulso' },
    { enumType: 'BoostType', enumValue: 'BOOST', locale: 'es', label: 'Impulso' },

    { enumType: 'BoostType', enumValue: 'SUPERBOOST', locale: 'en', label: 'Super Boost' },
    { enumType: 'BoostType', enumValue: 'SUPERBOOST', locale: 'pt', label: 'Super Impulso' },
    { enumType: 'BoostType', enumValue: 'SUPERBOOST', locale: 'es', label: 'Super Impulso' },

    // ---------------------------------------------------------
    // 🚀 BoostStatus
    // ---------------------------------------------------------
    { enumType: 'BoostStatus', enumValue: 'PENDING', locale: 'en', label: 'Pending' },
    { enumType: 'BoostStatus', enumValue: 'PENDING', locale: 'pt', label: 'Pendente' },
    { enumType: 'BoostStatus', enumValue: 'PENDING', locale: 'es', label: 'Pendiente' },

    { enumType: 'BoostStatus', enumValue: 'ACTIVE', locale: 'en', label: 'Active' },
    { enumType: 'BoostStatus', enumValue: 'ACTIVE', locale: 'pt', label: 'Ativo' },
    { enumType: 'BoostStatus', enumValue: 'ACTIVE', locale: 'es', label: 'Activo' },

    { enumType: 'BoostStatus', enumValue: 'EXPIRED', locale: 'en', label: 'Expired' },
    { enumType: 'BoostStatus', enumValue: 'EXPIRED', locale: 'pt', label: 'Expirado' },
    { enumType: 'BoostStatus', enumValue: 'EXPIRED', locale: 'es', label: 'Expirado' },

    { enumType: 'BoostStatus', enumValue: 'CANCELED', locale: 'en', label: 'Canceled' },
    { enumType: 'BoostStatus', enumValue: 'CANCELED', locale: 'pt', label: 'Cancelado' },
    { enumType: 'BoostStatus', enumValue: 'CANCELED', locale: 'es', label: 'Cancelado' },

    // ---------------------------------------------------------
    // 🧍 Pronoun
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 🚻 Gender
    // ---------------------------------------------------------
    { enumType: 'Gender', enumValue: 'MALE', locale: 'en', label: 'Male' },
    { enumType: 'Gender', enumValue: 'MALE', locale: 'pt', label: 'Homem' },
    { enumType: 'Gender', enumValue: 'MALE', locale: 'es', label: 'Hombre' },

    { enumType: 'Gender', enumValue: 'FEMALE', locale: 'en', label: 'Female' },
    { enumType: 'Gender', enumValue: 'FEMALE', locale: 'pt', label: 'Mulher' },
    { enumType: 'Gender', enumValue: 'FEMALE', locale: 'es', label: 'Mujer' },

    { enumType: 'Gender', enumValue: 'NON_BINARY', locale: 'en', label: 'Non-binary' },
    { enumType: 'Gender', enumValue: 'NON_BINARY', locale: 'pt', label: 'Não-binário' },
    { enumType: 'Gender', enumValue: 'NON_BINARY', locale: 'es', label: 'No binario' },

    { enumType: 'Gender', enumValue: 'OTHER', locale: 'en', label: 'Other' },
    { enumType: 'Gender', enumValue: 'OTHER', locale: 'pt', label: 'Outro' },
    { enumType: 'Gender', enumValue: 'OTHER', locale: 'es', label: 'Otro' },

    // ---------------------------------------------------------
    // ❤️ Intention
    // ---------------------------------------------------------
    ...[
      ['FRIENDS','Friends','Amizade','Amistad'],
      ['DATING','Dating','Namoro','Citas'],
      ['LONG_TERM','Long-term relationship','Relacionamento sério','Relación seria'],
      ['CASUAL','Casual','Casual','Casual'],
      ['NETWORKING','Networking','Networking','Red de contactos'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'Intention', enumValue:value, locale:'en', label:en },
      { enumType:'Intention', enumValue:value, locale:'pt', label:pt },
      { enumType:'Intention', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // 💞 RelationshipType
    // ---------------------------------------------------------
    ...[
      ['MONOGAMY','Monogamy','Monogamia','Monogamia'],
      ['NON_MONOGAMY','Non-monogamy','Não monogamia','No monogamia'],
      ['OPEN','Open relationship','Relacionamento aberto','Relación abierta'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'RelationshipType', enumValue:value, locale:'en', label:en },
      { enumType:'RelationshipType', enumValue:value, locale:'pt', label:pt },
      { enumType:'RelationshipType', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // 🎓 EducationLevel
    // ---------------------------------------------------------
    ...[
      ['HIGH_SCHOOL','High School','Ensino médio','Secundaria'],
      ['BACHELOR','Bachelor’s degree','Graduação','Licenciatura'],
      ['MASTER','Master’s degree','Mestrado','Maestría'],
      ['PHD','PhD / Doctorate','Doutorado','Doctorado'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'EducationLevel', enumValue:value, locale:'en', label:en },
      { enumType:'EducationLevel', enumValue:value, locale:'pt', label:pt },
      { enumType:'EducationLevel', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // 🚬 SmokingStatus
    // ---------------------------------------------------------
    ...[
      ['NO','No','Não','No'],
      ['SOCIALLY','Socially','Socialmente','Socialmente'],
      ['YES','Yes','Sim','Sí'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'SmokingStatus', enumValue:value, locale:'en', label:en },
      { enumType:'SmokingStatus', enumValue:value, locale:'pt', label:pt },
      { enumType:'SmokingStatus', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // 🍷 DrinkingStatus
    // ---------------------------------------------------------
    ...[
      ['NO','No','Não','No'],
      ['SOCIALLY','Socially','Socialmente','Socialmente'],
      ['YES','Yes','Sim','Sí'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'DrinkingStatus', enumValue:value, locale:'en', label:en },
      { enumType:'DrinkingStatus', enumValue:value, locale:'pt', label:pt },
      { enumType:'DrinkingStatus', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // ⚽ ActivityFrequency
    // ---------------------------------------------------------
    ...[
      ['LOW','Low','Baixa','Baja'],
      ['MEDIUM','Medium','Média','Media'],
      ['HIGH','High','Alta','Alta'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'ActivityFrequency', enumValue:value, locale:'en', label:en },
      { enumType:'ActivityFrequency', enumValue:value, locale:'pt', label:pt },
      { enumType:'ActivityFrequency', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // 🐶 PetsPreference
    // ---------------------------------------------------------
    ...[
      ['NONE','None','Nenhum','Ninguno'],
      ['DOG','Dog','Cachorro','Perro'],
      ['CAT','Cat','Gato','Gato'],
      ['DOG_AND_CAT','Dog and Cat','Cachorro e gato','Perro y gato'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'PetsPreference', enumValue:value, locale:'en', label:en },
      { enumType:'PetsPreference', enumValue:value, locale:'pt', label:pt },
      { enumType:'PetsPreference', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // 💬 CommunicationStyle
    // ---------------------------------------------------------
    ...[
      ['DIRECT','Direct','Direto','Directo'],
      ['HUMOR','Humorous','Bem-humorado','Humorístico'],
      ['EMPATHETIC','Empathetic','Empático','Empático'],
      ['ANALYTICAL','Analytical','Analítico','Analítico'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'CommunicationStyle', enumValue:value, locale:'en', label:en },
      { enumType:'CommunicationStyle', enumValue:value, locale:'pt', label:pt },
      { enumType:'CommunicationStyle', enumValue:value, locale:'es', label:es },
    ]),

    // ---------------------------------------------------------
    // ♈ ZodiacSign
    // ---------------------------------------------------------
    ...[
      ['ARIES','Aries','Áries','Aries'],
      ['TAURUS','Taurus','Touro','Tauro'],
      ['GEMINI','Gemini','Gêmeos','Géminis'],
      ['CANCER','Cancer','Câncer','Cáncer'],
      ['LEO','Leo','Leão','Leo'],
      ['VIRGO','Virgo','Virgem','Virgo'],
      ['LIBRA','Libra','Libra','Libra'],
      ['SCORPIO','Scorpio','Escorpião','Escorpio'],
      ['SAGITTARIUS','Sagittarius','Sagitário','Sagitario'],
      ['CAPRICORN','Capricorn','Capricórnio','Capricornio'],
      ['AQUARIUS','Aquarius','Aquário','Acuario'],
      ['PISCES','Pisces','Peixes','Piscis'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'ZodiacSign', enumValue:value, locale:'en', label:en },
      { enumType:'ZodiacSign', enumValue:value, locale:'pt', label:pt },
      { enumType:'ZodiacSign', enumValue:value, locale:'es', label:es },
    ]),

    // 🌎 Language
...[
  ['ENGLISH','English','Inglês','Inglés'],
  ['SPANISH','Spanish','Espanhol','Español'],
  ['PORTUGUESE','Portuguese','Português','Portugués'],
  ['FRENCH','French','Francês','Francés'],
  ['GERMAN','German','Alemão','Alemán'],
  ['ITALIAN','Italian','Italiano','Italiano'],
  ['CHINESE','Chinese','Chinês','Chino'],
  ['JAPANESE','Japanese','Japonês','Japonés'],
  ['KOREAN','Korean','Coreano','Coreano'],
  ['ARABIC','Arabic','Árabe','Árabe'],
  ['HINDI','Hindi','Hindi','Hindi'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'Language', enumValue:value, locale:'en', label:en },
  { enumType:'Language', enumValue:value, locale:'pt', label:pt },
  { enumType:'Language', enumValue:value, locale:'es', label:es },
]),

// 🏃 InterestActivity
...[
  ['TRAVEL','Travel','Viagens','Viajes'],
  ['COOKING','Cooking','Culinária','Cocina'],
  ['READING','Reading','Leitura','Lectura'],
  ['HIKING','Hiking','Trilhas','Senderismo'],
  ['BEACH','Beach','Praia','Playa'],
  ['VIDEO_GAMES','Video games','Videogames','Videojuegos'],
  ['PHOTOGRAPHY','Photography','Fotografia','Fotografía'],
  ['GYM','Gym','Academia','Gimnasio'],
  ['RUNNING','Running','Corrida','Correr'],
  ['YOGA','Yoga','Yoga','Yoga'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestActivity', enumValue:value, locale:'en', label:en },
  { enumType:'InterestActivity', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestActivity', enumValue:value, locale:'es', label:es },
]),

// 🌿 InterestLifestyle
...[
  ['HEALTHY','Healthy lifestyle','Estilo saudável','Estilo saludable'],
  ['VEGAN','Vegan','Vegano','Vegano'],
  ['MINIMALIST','Minimalist','Minimalista','Minimalista'],
  ['ENTREPRENEUR','Entrepreneur','Empreendedor','Emprendedor'],
  ['DIGITAL_NOMAD','Digital nomad','Nômade digital','Nómada digital'],
  ['PET_LOVER','Pet lover','Amante de pets','Amante de mascotas'],
  ['SPIRITUAL','Spiritual','Espiritual','Espiritual'],
  ['ECO_FRIENDLY','Eco-friendly','Sustentável','Ecológico'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestLifestyle', enumValue:value, locale:'en', label:en },
  { enumType:'InterestLifestyle', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestLifestyle', enumValue:value, locale:'es', label:es },
]),

// 🎨 InterestCreativity
...[
  ['ART','Art','Arte','Arte'],
  ['DRAWING','Drawing','Desenho','Dibujo'],
  ['PAINTING','Painting','Pintura','Pintura'],
  ['WRITING','Writing','Escrita','Escritura'],
  ['DANCING','Dancing','Dança','Baile'],
  ['DESIGN','Design','Design','Diseño'],
  ['MAKEUP','Makeup','Maquiagem','Maquillaje'],
  ['CRAFTS','Crafts','Artesanato','Manualidades'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestCreativity', enumValue:value, locale:'en', label:en },
  { enumType:'InterestCreativity', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestCreativity', enumValue:value, locale:'es', label:es },
]),

// 🏋️ InterestSports
...[
  ['FOOTBALL','Football','Futebol americano','Fútbol americano'],
  ['SOCCER','Soccer','Futebol','Fútbol'],
  ['BASKETBALL','Basketball','Basquete','Baloncesto'],
  ['TENNIS','Tennis','Tênis','Tenis'],
  ['BOXING','Boxing','Boxe','Boxeo'],
  ['MMA','MMA','MMA','MMA'],
  ['SWIMMING','Swimming','Natação','Natación'],
  ['CYCLING','Cycling','Ciclismo','Ciclismo'],
  ['CROSSFIT','Crossfit','Crossfit','Crossfit'],
  ['RUNNING','Running','Corrida','Correr'],
  ['GYM','Gym','Academia','Gimnasio'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestSports', enumValue:value, locale:'en', label:en },
  { enumType:'InterestSports', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestSports', enumValue:value, locale:'es', label:es },
]),

// 🎵 InterestMusic
...[
  ['POP','Pop','Pop','Pop'],
  ['ROCK','Rock','Rock','Rock'],
  ['RAP','Rap','Rap','Rap'],
  ['EDM','EDM','EDM','EDM'],
  ['JAZZ','Jazz','Jazz','Jazz'],
  ['CLASSICAL','Classical','Clássica','Clásica'],
  ['HIPHOP','Hip Hop','Hip Hop','Hip Hop'],
  ['COUNTRY','Country','Country','Country'],
  ['REGGAE','Reggae','Reggae','Reggae'],
  ['BLUES','Blues','Blues','Blues'],
  ['KPOP','K-pop','K-pop','K-pop'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestMusic', enumValue:value, locale:'en', label:en },
  { enumType:'InterestMusic', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestMusic', enumValue:value, locale:'es', label:es },
]),


// 🌃 InterestNightlife
...[
  ['BARS','Bars','Bares','Bares'],
  ['CLUBS','Clubs','Clubes','Clubes'],
  ['LOUNGES','Lounges','Lounge','Lounge'],
  ['CONCERTS','Concerts','Shows','Conciertos'],
  ['FESTIVALS','Festivals','Festivais','Festivales'],
  ['KARAOKE','Karaoke','Karaokê','Karaoke'],
  ['LIVE_MUSIC','Live music','Música ao vivo','Música en vivo'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestNightlife', enumValue:value, locale:'en', label:en },
  { enumType:'InterestNightlife', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestNightlife', enumValue:value, locale:'es', label:es },
]),


// 🎬 InterestTvCinema
...[
  ['ACTION','Action','Ação','Acción'],
  ['COMEDY','Comedy','Comédia','Comedia'],
  ['DRAMA','Drama','Drama','Drama'],
  ['HORROR','Horror','Terror','Terror'],
  ['ROMANCE','Romance','Romance','Romance'],
  ['FANTASY','Fantasy','Fantasia','Fantasía'],
  ['SCIFI','Sci-Fi','Ficção científica','Ciencia ficción'],
  ['DOCUMENTARY','Documentary','Documentário','Documental'],
  ['ANIME','Anime','Anime','Anime'],
  ['SERIES','Series','Séries','Series'],
  ['MOVIES','Movies','Filmes','Películas'],
  ['OTHER','Other','Outro','Otro'],
].flatMap(([value,en,pt,es]) => [
  { enumType:'InterestTvCinema', enumValue:value, locale:'en', label:en },
  { enumType:'InterestTvCinema', enumValue:value, locale:'pt', label:pt },
  { enumType:'InterestTvCinema', enumValue:value, locale:'es', label:es },
]),


    // ---------------------------------------------------------
    // 🌈 SexualOrientation
    // ---------------------------------------------------------
    ...[
      ['STRAIGHT','Straight','Heterossexual','Heterosexual'],
      ['GAY','Gay','Gay','Gay'],
      ['LESBIAN','Lesbian','Lésbica','Lesbiana'],
      ['BISEXUAL','Bisexual','Bissexual','Bisexual'],
      ['ASEXUAL','Asexual','Assexual','Asexual'],
      ['PANSEXUAL','Pansexual','Pansexual','Pansexual'],
      ['QUEER','Queer','Queer','Queer'],
      ['OTHER','Other','Outro','Otro'],
    ].flatMap(([value,en,pt,es]) => [
      { enumType:'SexualOrientation', enumValue:value, locale:'en', label:en },
      { enumType:'SexualOrientation', enumValue:value, locale:'pt', label:pt },
      { enumType:'SexualOrientation', enumValue:value, locale:'es', label:es },
    ]),
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
