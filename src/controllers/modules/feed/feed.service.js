// src/modules/feed/feed.service.js

const { prisma } = require("../../../dataBase/prisma");

// PRE-CÁLCULO AUTOMÁTICO
const { precalculateCompatibility } = require("../../../jobs/precalculateCompatibility");
const precalcState = require("../../../jobs/state/precalcState");

// ----------------------------
// FREE vs PREMIUM
// ----------------------------
function filterProfileByPlan(profile, isPremiumRoute) {
  if (isPremiumRoute) return profile;

  const allowed = [
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

  const out = {};
  for (const k of allowed) if (profile && profile[k] !== undefined) out[k] = profile[k];
  return out;
}

module.exports = {
  // ======================================================
  // ⚡ LISTA ULTRA RÁPIDA DO FEED (sem traduções)
  // ======================================================
  async list(query, loggedUser) {
    const page = Math.max(parseInt(query.page || "1"), 1);
    const limit = Math.max(parseInt(query.limit || "20"), 1);
    const skip = (page - 1) * limit;

    const isPremiumRoute =
      loggedUser.routeTag === "feed_list_premium" ||
      loggedUser.routeTag === "feed_list_super_premium";

    // ----------------------------
    // 1) PRÉ-CÁLCULO AUTOMÁTICO
    // ----------------------------
    const hasScores = await prisma.compatibilityScore.findFirst({
      where: { userA: loggedUser.id },
    });

    if (!hasScores && !precalcState.isRunning(loggedUser.id)) {
      console.log("⚡ INICIANDO PRÉ-CÁLCULO AUTOMÁTICO →", loggedUser.id);

      precalcState.start(loggedUser.id);

      precalculateCompatibility(loggedUser.id)
        .then(() => {
          console.log("✅ PRÉ-CÁLCULO FINALIZADO PARA:", loggedUser.id);
          precalcState.stop(loggedUser.id);
        })
        .catch((err) => {
          console.log("❌ ERRO NO PRÉ-CÁLCULO:", err);
          precalcState.stop(loggedUser.id);
        });
    }

    // ----------------------------
    // 2) BUSCA APENAS OS IDs ORDENADOS
    // ----------------------------
    const scores = await prisma.compatibilityScore.findMany({
      where: {
        userA: loggedUser.id,
        score: { gte: 30 },
      },
      orderBy: { score: "desc" },
      take: limit,
      skip,
    });

    if (scores.length === 0) {
      return {
        page,
        limit,
        total: 0,
        pages: 0,
        items: [],
      };
    }

    const ids = scores.map((s) => s.userB);

    // ----------------------------
    // 3) CARREGA OS USUÁRIOS
    // ----------------------------
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      include: {
        profile: true,
        preference: true,
        photos: true,
      },
    });

    // ----------------------------
    // 4) MONTA RESPOSTA (SEM TRADUÇÃO)
    // ----------------------------
    const items = users.map((u) => ({
      ...u,
      profile: filterProfileByPlan(u.profile || {}, isPremiumRoute),

      // NÃO TRADUZ — ENVIA ENUM PURO
      preference: u.preference || {},

      score: scores.find((s) => s.userB === u.id)?.score ?? 0,
    }));

    return {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit),
      items,
    };
  },

  // ----------------------------
  // GET ONE (mesmo da versão antiga)
  // ----------------------------
  async getOne(id, loggedUser) {
    const u = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        preference: true,
        photos: true,
      },
    });

    if (!u) throw new Error("Usuário não encontrado");

    const isPremiumRoute =
      loggedUser.routeTag === "feed_view_premium" ||
      loggedUser.routeTag === "feed_view_super_premium";

    return {
      ...u,
      profile: filterProfileByPlan(u.profile || {}, isPremiumRoute),
      preference: u.preference || {},
    };
  },
};
