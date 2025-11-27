const serv = require("../services/projetos.services");

module.exports = {
  
  async listar(req, res) {
    try {
      const dados = await serv.listar(req.usuarioId);
      res.status(200).json(dados);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar projetos" });
    }
  },


  async buscarPorId(req, res) {
    try {
      const projeto = await serv.buscarPorId(req.params.id, req.usuarioId);
      if (!projeto) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.status(200).json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar projeto" });
    }
  },

  
  async criar(req, res) {
    try {
      const dados = await serv.criar({ ...req.body, usuarioId: req.usuarioId });
      res.status(201).json(dados);
    } catch (error) {
      res.status(400).json({ error: error.message || "Dados inválidos" });
    }
  },


  async atualizar(req, res) {
    try {
      const atualizado = await serv.atualizar(req.params.id, req.usuarioId, req.body);
      if (!atualizado) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.status(200).json(atualizado);
    } catch (error) {
      res.status(400).json({ error: error.message || "Dados inválidos" });
    }
  },


  async deletar(req, res) {
    try {
      const apagado = await serv.deletar(req.params.id, req.usuarioId);
      if (!apagado) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar projeto" });
    }
  }
};
