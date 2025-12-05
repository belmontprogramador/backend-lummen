// src/modules/feed/feed.service.js

const { prisma } = require("../../../dataBase/prisma");
const redis = require("../../../utils/redisClient");

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
 async list(query, loggedUser) {
  try {
    const page = Math.max(parseInt(query.page || "1"), 1);
    const limit = Math.max(parseInt(query.limit || "20"), 1);
    const skip = (page - 1) * limit;

    console.log("🔥 FEED → INIT", {
      userId: loggedUser.id,
      page,
      limit,
      skip,
    });

    const redisKey = `compat:${loggedUser.id}`;

    console.log("🔥 FEED - checando redisKey:", redisKey);

    const totalRedis = await redis.zCard(redisKey);
    console.log("🔥 FEED - totalRedis =", totalRedis);

    // BUSCA IDs no Redis
    console.log("🔥 FEED - buscando ZRANGE...");

    let raw;
    try {
      raw = await redis.zRange(redisKey, skip, skip + limit - 1, {
        REV: true,
        WITHSCORES: true
      });
    } catch (zrErr) {
      console.error("❌ ERRO NO ZRANGE:", zrErr);
      throw zrErr; // deixa cair no catch externo
    }

    console.log("🔥 FEED - RAW DO REDIS =", raw);

    if (!raw || raw.length === 0) {
      return {
        page,
        limit,
        total: 0,
        pages: 0,
        items: [],
      };
    }

    // PROCESSAR IDS E SCORES
    const ids = [];
    const scoresMap = {};

    for (let i = 0; i < raw.length; i += 2) {
      const userId = raw[i];
      const score = Number(raw[i + 1]);
      ids.push(userId);
      scoresMap[userId] = score;
    }

    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      include: {
        profile: true,
        preference: true,
        photos: true,
      },
    });

    const items = users.map((u) => ({
      ...u,
      score: scoresMap[u.id] ?? 0,
    }));

    return {
      page,
      limit,
      total: totalRedis,
      pages: Math.ceil(totalRedis / limit),
      items,
    };
  } catch (err) {
    console.error("❌ ERRO GERAL NO FEED:", err);
    throw err;
  }
},

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
