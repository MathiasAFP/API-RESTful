const serv = require("../services/membros.services");

module.exports = {
  async listar(req, res) {
    try {
      const membros = await serv.listar(req.usuarioId);
      res.status(200).json(membros);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar membros" });
    }
  },


  async buscarPorId(req, res) {
    try {
      const membro = await serv.buscarPorId(req.params.id, req.usuarioId);
      if (!membro) {
        return res.status(404).json({ message: "Membro não encontrado" });
      }
      res.status(200).json(membro);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar membro" });
    }
  },


  async criar(req, res) {
    try {
      const criado = await serv.criar({
        nome: req.body.nome,
        projetoId: req.body.projetoId,
        usuarioId: req.usuarioId
      });
      res.status(201).json(criado);
    } catch (error) {
      res.status(400).json({ error: error.message || "Dados inválidos" });
    }
  },

  async atualizar(req, res) {
    try {
      const atualizado = await serv.atualizar(req.params.id, req.body, req.usuarioId);
      if (!atualizado) {
        return res.status(404).json({ message: "Membro não encontrado" });
      }
      res.status(200).json(atualizado);
    } catch (error) {
      res.status(400).json({ error: error.message || "Dados inválidos" });
    }
  },


  async deletar(req, res) {
    try {
      const d = await serv.deletar(req.params.id, req.usuarioId);
      if (!d) {
        return res.status(404).json({ message: "Membro não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar membro" });
    }
  }
};
