const service = require("./userPhoto.service");
const validator = require("./userPhoto.validator");

module.exports = {
  async list(req, res) {
    try {
      validator.validateList(req.params);
      const result = await service.list(req.params.userId);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      validator.validateCreate(req.body);

      if (!req.file) {
        throw new Error("photo é obrigatória");
      }

      const result = await service.create(req.params.userId, req.file);
      return res.status(201).json(result);

    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async bulkUpdate(req, res) {
  try {
    const userId = req.params.userId;

    if (!req.body.data) {
      throw new Error("Campo 'data' é obrigatório");
    }

    const data = JSON.parse(req.body.data);
    const files = req.files || [];

    const result = await service.bulkUpdate(userId, data, files);

    return res.json(result);

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
},

  // 📌 MULTIPLAS FOTOS — MESMO PADRÃO
  async createMany(req, res) {
    try {
      validator.validateList(req.params); // mesmo padrão de validação

      const userId = req.params.userId;

      if (!req.files || req.files.length === 0) {
        throw new Error("Nenhuma foto enviada");
      }

      const result = await service.createMany(userId, req.files);

      return res.status(201).json(result);

    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
  },

  async updateByPosition(req, res) {
    try {
      validator.validateUpdatePosition(req.params);

      if (!req.file) {
        throw new Error("photo é obrigatória");
      }

      const result = await service.updateByPosition(
        req.params.userId,
        req.params.position,
        req.file
      );

      return res.json(result);

    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      validator.validateDelete(req.params);

      const result = await service.remove(req.params.photoId);
      return res.json({ success: true, deleted: result });

    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
