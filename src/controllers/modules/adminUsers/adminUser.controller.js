// src/controllers/modules/adminUsers/adminUser.controller.js

const service = require("./adminUser.service");

module.exports = {
  // ---------------------------------------------------------
  // LISTAR USUÁRIOS
  // ---------------------------------------------------------
  async list(req, res) {
    try {
      const data = await service.list(req.query);
      return res.json(data);
    } catch (err) {
      console.error("Erro em adminUsers.list:", err);
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
  },

  // ---------------------------------------------------------
  // BUSCAR 1 USUÁRIO COMPLETO
  // ---------------------------------------------------------
  async getOne(req, res) {
    try {
      const user = await service.getOne(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json(user);

    } catch (err) {
      console.error("Erro em adminUsers.getOne:", err);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  // ---------------------------------------------------------
  // UPDATE TOTAL (inclui todas as tabelas associadas)
  // ---------------------------------------------------------
  async update(req, res) {
    try {
      const updated = await service.update(req.params.id, req.body);
      return res.json(updated);

    } catch (err) {
      console.error("Erro em adminUsers.update:", err);

      return res
        .status(500)
        .json({ error: "Erro ao atualizar usuário" });
    }
  },

  // ---------------------------------------------------------
  // REMOVER USUÁRIO
  // ---------------------------------------------------------
  async remove(req, res) {
    try {
      await service.remove(req.params.id);
      return res.json({ success: true });

    } catch (err) {
      console.error("Erro em adminUsers.remove:", err);

      return res
        .status(500)
        .json({ error: "Erro ao excluir usuário" });
    }
  }
};
