const repo = require("./plan.repository");
const axios = require("axios");

// -------------------------------------------------------------
// Detecta país pelo IP (agora recebe só o IP, não req)
// -------------------------------------------------------------
async function detectCountry(ip) {
  try {
    if (!ip) return "US";

    const res = await axios.get(`https://ipapi.co/${ip}/json/`);
    return res.data.country || "US";

  } catch (error) {
    console.error("Erro ao detectar país:", error);
    return "US";
  }
}

// -------------------------------------------------------------
// Retorna o preço conforme país
// -------------------------------------------------------------
function pickPrice(plan, country) {
  const c = country.toUpperCase();

  if (c === "BR") return { price: plan.priceBrl, currency: "BRL" };

  const EU = ["PT", "ES", "FR", "DE", "NL", "IT"];
  if (EU.includes(c)) return { price: plan.priceEur, currency: "EUR" };

  return { price: plan.priceUsd, currency: "USD" };
}


module.exports = {
  // CRUD ADMIN --------------------------------------------------
  create: payload => repo.create(payload),

  list: async (page = 1, limit = 20) => {
    const skip = (Number(page) - 1) * Number(limit);
    const [total, items] = await Promise.all([
      repo.count(),
      repo.list(skip, Number(limit))
    ]);

    return {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
      items
    };
  },

  getOne: id => repo.getOne(id),

  update: (id, payload) => repo.update(id, payload),

  remove: id => repo.remove(id),

  listRoutes: () => repo.getAllRoutes(),

 // -------------------------------------------------------------
  // PUBLIC LIST
  // -------------------------------------------------------------
  async listPublic(ip) {

    const country = await detectCountry(ip);

    let where = {};

    if (country === "BR") {
      where = { priceBrl: { not: null } };
    } else {
      const EU = ["PT", "ES", "FR", "DE", "NL", "IT"];
      where = EU.includes(country)
        ? { priceEur: { not: null } }
        : { priceUsd: { not: null } };
    }

    const plans = await repo.listFiltered(where);

    return plans.map(plan => {
      const selected = pickPrice(plan, country);

      return {
        id: plan.id,
        name: plan.name,
        title: plan.title,
        price: selected.price,
        currency: selected.currency,
        features: plan.features,
        durationDays: plan.durationDays
      };
    });
  },

};
