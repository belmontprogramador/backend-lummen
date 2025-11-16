// src/modules/users/user.controller.js
const service = require("./user.service");

module.exports = {
  async create(req, res) {
    try {
      const result = await service.register(req.body, req.file);
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password);
      return res.json(result);
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  },

async list(req, res) {
  try {
    const userId = req.user.id; // usuário logado (do JWT)
    const result = await service.list(req.query, userId);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
},

async getOne(req, res) {
  try {
    const { id } = req.params;
    const user = await service.getOne(id);
    return res.json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
},

async update(req, res) {
  try {
    const result = await service.update(req.params.id, req.body, req.files);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
},

  async remove(req, res) {
    try {
      await service.remove(req.params.id);
      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async setPaidWebhook(req, res) {
  try {
    const result = await service.setPaidWebhook(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
},

  async updatePassword(req, res) {
    try {
      const result = await service.updatePassword(req.user.id, req.body);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async forgotPassword(req, res) {
    try {
      const result = await service.forgotPassword(req.body.email);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const result = await service.resetPassword(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async changePassword(req, res) {
  try {
    const result = await service.changePassword(req.user.id, req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

};
