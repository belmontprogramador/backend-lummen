const repository = require("./feed.repository");
const {
  translateProfileEnums,
  translatePreferenceEnums,
} = require("../../../utils/enumTranslator");

//
// 🔥 Filtra o perfil dependendo se a rota é FREE ou PREMIUM
//
function filterProfileByPlan(profile, isPremiumRoute) {
  if (isPremiumRoute) {
    // PREMIUM vê tudo
    return profile;
  }

  // ✅ FREE vê só o básico (COM CAMPOS TRADUZIDOS CORRETOS)
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
    "intention",          // ✅ CORREÇÃO
    "relationshipType",  // ✅ CORREÇÃO
  ];

  const filtered = {};
  for (const key of allowedKeys) {
    if (profile && profile[key] !== undefined) {
      filtered[key] = profile[key];
    }
  }

  return filtered;
}

module.exports = {
  // =========================
  // ✅ LISTA DO FEED
  // =========================
  async list(query, loggedUser, locale = "en") {
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.max(parseInt(query.limit || "20", 10), 1);
    const skip = (page - 1) * limit;

    const filter = {};

    const [total, raw] = await Promise.all([
      repository.count(filter),
      repository.list({
        skip,
        limit,
        where: filter,
        loggedUserId: loggedUser.id,
      }),
    ]);

    const routeTag = loggedUser.routeTag || "";
    const isPremiumRoute =
      routeTag === "feed_list_premium" ||
      routeTag === "feed_list_super_premium";

    const items = await Promise.all(
      raw.map(async (u) => {
        // ✅ TRADUZ PERFIL
        const translatedProfile = await translateProfileEnums(
          u.profile || {},
          locale
        );

        const filteredProfile = filterProfileByPlan(
          translatedProfile,
          isPremiumRoute
        );

        // ✅ TRADUZ PREFERÊNCIAS
        const translatedPreference = await translatePreferenceEnums(
          u.preference || {},
          locale
        );

        return {
          ...u,
          profile: filteredProfile,
          preference: translatedPreference,
        };
      })
    );

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    };
  },

  // =========================
  // ✅ ITEM ÚNICO DO FEED
  // =========================
  async getOne(id, loggedUser, locale = "en") {
    const u = await repository.getById(id);
    if (!u) throw new Error("Usuário não encontrado");

    // ✅ PERFIL TRADUZIDO
    const translatedProfile = await translateProfileEnums(
      u.profile || {},
      locale
    );

    const routeTag = loggedUser.routeTag || "";
    const isPremiumRoute =
      routeTag === "feed_view_premium" ||
      routeTag === "feed_view_super_premium";

    const filteredProfile = filterProfileByPlan(
      translatedProfile,
      isPremiumRoute
    );

    // ✅ PREFERÊNCIAS TRADUZIDAS
    const translatedPreference = await translatePreferenceEnums(
      u.preference || {},
      locale
    );

    return {
      ...u,
      profile: filteredProfile,
      preference: translatedPreference,
    };
  },
};
