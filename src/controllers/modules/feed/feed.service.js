const repository = require("./feed.repository");
const { translateProfileEnums } = require("../../../utils/enumTranslator");

//
// 🔥 Filtra o perfil dependendo se a rota é FREE ou PREMIUM
//
function filterProfileByPlan(profile, isPremiumRoute) {
  if (isPremiumRoute) {
    // PREMIUM vê tudo
    return profile;
  }

  // FREE vê só o básico (ajusta essa lista como quiser)
  const allowedKeys = [
    "bio",
    "gender",
    "orientation",
    "pronoun",
    "city",
    "state",
    "country",
    "languages", // se quiser esconder, tira daqui
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
  // LISTA FEED
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

    // saber se rota é premium ou free
    const routeTag = loggedUser.routeTag || "";
    const isPremiumRoute = routeTag === "feed_list_premium";

    const items = await Promise.all(
      raw.map(async (u) => {
        // traduz enums do perfil unificado
        const translatedProfile = await translateProfileEnums(
          u.profile || {},
          locale
        );

        // aplica filtro por plano/rota
        const filteredProfile = filterProfileByPlan(
          translatedProfile,
          isPremiumRoute
        );

        return {
          ...u,
          profile: filteredProfile,
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

  // GET ONE
  async getOne(id, loggedUser, locale = "en") {
    const u = await repository.getById(id);
    if (!u) throw new Error("Usuário não encontrado");

    const translatedProfile = await translateProfileEnums(
      u.profile || {},
      locale
    );

    const routeTag = loggedUser.routeTag || "";
    const isPremiumRoute = routeTag === "feed_view_premium";

    const filteredProfile = filterProfileByPlan(
      translatedProfile,
      isPremiumRoute
    );

    return {
      ...u,
      profile: filteredProfile,
    };
  },
};
