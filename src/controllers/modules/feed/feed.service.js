// src/modules/feed/feed.service.js

const repository = require("./feed.repository");
const { prisma } = require("../../../dataBase/prisma");
const calculateCompatibility = require("../../../utils/calculateCompatibility");
const {
  translateProfileEnums,
  translatePreferenceEnums,
} = require("../../../utils/enumTranslator");


// ------------------------------------------------------
// 🔥 Filtra o perfil dependendo se a rota é FREE ou PREMIUM
// ------------------------------------------------------
function filterProfileByPlan(profile, isPremiumRoute) {
  if (isPremiumRoute) {
    return profile; // PREMIUM vê tudo
  }

  const allowedKeys = [
    "bio",
    "birthday",
    "gender",
    "orientation",
    "pronoun",
    "city",
    "state",
    "country",
    "languages",
    "intention",
    "relationshipType",
  ];

  const filtered = {};
  for (const key of allowedKeys) {
    if (profile && profile[key] !== undefined) {
      filtered[key] = profile[key];
    }
  }

  return filtered;
}


// ------------------------------------------------------
// 🔥 FUNÇÃO PARA BUSCAR PERFIL + PREFERENCES DO USUÁRIO LOGADO
// ------------------------------------------------------
async function loadLoggedUserFull(loggedUserId, locale = "en") {
  const dbUser = await prisma.user.findUnique({
    where: { id: loggedUserId },
    include: {
      profile: true,
      preference: true,
    },
  });

  if (!dbUser) {
    throw new Error("Usuário logado não encontrado no banco.");
  }

  const translatedProfile = await translateProfileEnums(dbUser.profile || {}, locale);
  const translatedPreference = await translatePreferenceEnums(dbUser.preference || {}, locale);

  return {
    ...dbUser,
    profile: translatedProfile || {},
    preference: translatedPreference || {},
  };
}


// ------------------------------------------------------
// ✅ LISTA DO FEED (COM SCORE)
// ------------------------------------------------------
module.exports = {
  async list(query, loggedUser, locale = "en") {
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.max(parseInt(query.limit || "20", 10), 1);
    const skip = (page - 1) * limit;

    const filter = {};

    // 🔍 Buscar usuários do feed respeitando like/dislike/skip
    const raw = await repository.list({
      skip,
      limit,
      where: filter,
      loggedUserId: loggedUser.id,
    });

    // 🔥 Carrega PERFIL + PREFERENCES completos do usuário logado
    const fullLoggedUser = await loadLoggedUserFull(loggedUser.id, locale);

    const routeTag = loggedUser.routeTag || "";
    const isPremiumRoute =
      routeTag === "feed_list_premium" ||
      routeTag === "feed_list_super_premium";

    // 🔥 Traduz, filtra e calcula score
    let items = await Promise.all(
      raw.map(async (u) => {
        const translatedProfile = await translateProfileEnums(u.profile || {}, locale);
        const translatedPreference = await translatePreferenceEnums(u.preference || {}, locale);

        const filteredProfile = filterProfileByPlan(
          translatedProfile,
          isPremiumRoute
        );

        console.log("===> Calculando score para:", u.id);

        let score = 0;

        try {
          score = calculateCompatibility(
            fullLoggedUser,
            {
              ...u,
              profile: translatedProfile,
              preference: translatedPreference,
            }
          );
             console.log(`📊 SCORE FINAL (${u.id}) =`, score);

        } catch (err) {
          console.log("🔥 ERRO AO CALCULAR SCORE DO USUÁRIO:", u.id);
          console.log("PROFILE =", JSON.stringify(u.profile, null, 2));
          console.log("PREFERENCE =", JSON.stringify(u.preference, null, 2));
          console.log("ERRO DETALHADO =", err.message);
          score = 0;
        }

        return {
          ...u,
          profile: filteredProfile,
          preference: translatedPreference,
          score,
        };
      })
    );

    // ❌ Remove compatibilidade baixa
    items = items.filter((i) => i.score >= 50);

    // 🔝 Ordena do maior score
    items.sort((a, b) => b.score - a.score);

    return {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit),
      items,
    };
  },


  // ------------------------------------------------------
  // ❗ GET ONE → NÃO TEM SCORE
  // ------------------------------------------------------
  async getOne(id, loggedUser, locale = "en") {
    const u = await repository.getById(id);
    if (!u) throw new Error("Usuário não encontrado");

    const translatedProfile = await translateProfileEnums(u.profile || {}, locale);
    const translatedPreference = await translatePreferenceEnums(u.preference || {}, locale);

    const routeTag = loggedUser.routeTag || "";
    const isPremiumRoute =
      routeTag === "feed_view_premium" ||
      routeTag === "feed_view_super_premium";

    const filteredProfile = filterProfileByPlan(
      translatedProfile,
      isPremiumRoute
    );

    return {
      ...u,
      profile: filteredProfile,
      preference: translatedPreference,
    };
  },
};
