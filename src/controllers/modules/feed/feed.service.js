const repository = require("./feed.repository");
const { translateProfileEnums } = require("../../../utils/enumTranslator");

module.exports = {
 async list(query, loggedUserId) {
  const page = Math.max(parseInt(query.page || "1"), 1);
  const limit = Math.max(parseInt(query.limit || "20"), 1);
  const skip = (page - 1) * limit;

  const locale = query.locale || "en";

  const filter = {};

  const [total, raw] = await Promise.all([
    repository.count(filter),
    repository.list({ skip, limit, where: filter, loggedUserId }),
  ]);

  // 🔥 traduz user por user de forma ASSÍNCRONA
  const items = await Promise.all(
    raw.map(async (u) => {
      const profile = {
        ...u.profileBasic,
        ...u.profileLocation,
        ...u.profileLifestyle,
        ...u.profileWork,
        ...u.profileRelation,
        ...u.profileInterests,
        ...u.profileExtra,
      };

      const translated = await translateProfileEnums(profile, locale);

      return {
        ...u,
        profile: translated,
      };
    })
  );

  // 🔥 AGORA SIM PODE LOGAR
  

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items,
  };
},

  async getOne(id, locale = "en") {
    const u = await repository.getById(id);
    if (!u) throw new Error("Usuário não encontrado");

    const profile = {
      ...u.profileBasic,
      ...u.profileLocation,
      ...u.profileLifestyle,
      ...u.profileWork,
      ...u.profileRelation,
      ...u.profileInterests,
      ...u.profileExtra,
    };

    const translated = await translateProfileEnums(profile, locale);

    return {
      ...u,
      profile: translated,
    };
  },
};
