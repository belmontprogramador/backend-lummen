// utils/calculateCompatibility.js

const haversine = require("./haversineDistance");

// ===============================
// 🔢 PESOS DO ALGORITMO
// ===============================
const WEIGHTS = {
  location: 30,
  intentions: 20,
  genderOrientation: 15,
  age: 15,
  hobbies: 10,
  lifestyle: 5,
  personality: 5,
  zodiac: 2,
};

// ========================================================
// 🧮 FUNÇÃO PRINCIPAL
// ========================================================
module.exports = function calculateCompatibility(userA, userB) {
  if (!userA || !userB) return 0;

  let score = 0;

  // ===============================
  // 📍 1. LOCALIZAÇÃO (Haversine)
  // ===============================
  if (userA.profile && userB.profile) {
    const dist = haversine(
      userA.profile.latitude,
      userA.profile.longitude,
      userB.profile.latitude,
      userB.profile.longitude
    );

    let locationScore = 0;

    if (dist <= 10) locationScore = WEIGHTS.location;
    else if (dist <= 30) locationScore = WEIGHTS.location * 0.8;
    else if (dist <= 80) locationScore = WEIGHTS.location * 0.4;
    else locationScore = 0;

    score += locationScore;
  }

  // ==================================================
  // ❤️ 2. GÊNERO + ORIENTAÇÃO
  // ==================================================
  if (userA.preference?.preferredGenders?.length > 0) {
    const matchGender = userA.preference.preferredGenders.some((g) =>
      userB.profile.gender.includes(g)
    );

    if (matchGender) score += WEIGHTS.genderOrientation * 0.5;
  }

  if (userA.preference?.preferredOrientations?.length > 0) {
    const matchOrientation = userA.preference.preferredOrientations.some((o) =>
      userB.profile.orientation.includes(o)
    );

    if (matchOrientation) score += WEIGHTS.genderOrientation * 0.5;
  }

  // ==================================================
  // 🎯 3. INTENÇÕES (LONG_TERM, FRIENDS, etc.)
  // ==================================================
  if (userA.preference?.preferredIntentions?.length > 0) {
    const intersect = userA.preference.preferredIntentions.filter((x) =>
      userB.profile.intention?.includes(x)
    );

    const ratio =
      intersect.length /
      (userA.preference.preferredIntentions.length || 1);

    score += ratio * WEIGHTS.intentions;
  }

  // ==================================================
  // 👤 4. IDADE
  // ==================================================
  if (userB.profile?.birthday) {
    const birth = new Date(userB.profile.birthday);
    const now = new Date();

    let age =
      now.getFullYear() -
      birth.getFullYear() -
      (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
        ? 1
        : 0);

    if (age >= userA.preference.ageMin && age <= userA.preference.ageMax) {
      score += WEIGHTS.age; // máximo
    } else {
      const diff =
        Math.min(
          Math.abs(age - userA.preference.ageMin),
          Math.abs(age - userA.preference.ageMax)
        ) || 15;

      let ageScore = Math.max(0, WEIGHTS.age - diff);
      score += ageScore;
    }
  }

  // ==================================================
  // 🎨 5. HOBBIES / INTERESSES (peso proporcional)
  // ==================================================
  const interestFields = [
    "interestsActivities",
    "interestsLifestyle",
    "interestsCreativity",
    "interestsSportsFitness",
    "interestsMusic",
    "interestsNightlife",
    "interestsTvCinema",
  ];

  let totalHits = 0;
  let totalPrefs = 0;

  interestFields.forEach((field) => {
    const pref = userA.preference?.[`preferred${capitalize(field)}`];
    const prof = userB.profile?.[field];

    if (Array.isArray(pref) && Array.isArray(prof)) {
      const hits = pref.filter((x) => prof.includes(x)).length;
      totalHits += hits;
      totalPrefs += pref.length;
    }
  });

  if (totalPrefs > 0) {
    const ratio = totalHits / totalPrefs;
    score += ratio * WEIGHTS.hobbies;
  }

  // ==================================================
  // 🌱 6. LIFESTYLE
  // ==================================================
  let lifestyleHits = 0;
  let lifestyleTotal = 0;

  const lifestyleFields = [
    "PetsPreference",
    "SmokingStatus",
    "DrinkingStatus",
    "Diet",
  ];

  lifestyleFields.forEach((field) => {
    const pref = userA.preference?.[`preferred${field}`];
    const prof = userB.profile?.[field.charAt(0).toLowerCase() + field.slice(1)];

    if (Array.isArray(pref) && Array.isArray(prof)) {
      const match = pref.some((p) => prof.includes(p));
      if (match) lifestyleHits++;
      lifestyleTotal++;
    }
  });

  if (lifestyleTotal > 0) {
    score += (lifestyleHits / lifestyleTotal) * WEIGHTS.lifestyle;
  }

  // ==================================================
  // 🧠 7. PERSONALIDADE
  // ==================================================
  if (
    Array.isArray(userA.preference?.preferredCommunication) &&
    Array.isArray(userB.profile?.communicationStyle)
  ) {
    const hits = userA.preference.preferredCommunication.filter((x) =>
      userB.profile.communicationStyle.includes(x)
    ).length;

    const ratio =
      hits / (userA.preference.preferredCommunication.length || 1);

    score += ratio * WEIGHTS.personality;
  }

  // ==================================================
  // 🔮 8. SIGNO
  // ==================================================
  if (Array.isArray(userA.preference?.preferredZodiacs)) {
    const matchZodiac = userA.preference.preferredZodiacs.some((z) =>
      userB.profile.zodiac?.includes(z)
    );

    if (matchZodiac) score += WEIGHTS.zodiac;
  }

  // 🚀 Limita para 0–100
  return Math.max(0, Math.min(100, Math.round(score)));
};

// ===============================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
