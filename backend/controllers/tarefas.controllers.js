const serv = require("../services/tarefas.services");

module.exports = {

  async listar(req, res) {
    try {
      const tarefas = await serv.listar(req.usuarioId);
      res.status(200).json(tarefas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar tarefas" });
    }
  },

 
  async buscarPorId(req, res) {
    try {
      const tarefa = await serv.buscarPorId(req.params.id, req.usuarioId);
      if (!tarefa) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
      res.status(200).json(tarefa);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar tarefa" });
    }
  },


  async criar(req, res) {
    try {
      const tarefa = await serv.criar({ ...req.body, usuarioId: req.usuarioId });
      res.status(201).json(tarefa);
    } catch (error) {
      res.status(400).json({ error: error.message || "Dados inválidos" });
    }
  },


  async atualizar(req, res) {
    try {
      const t = await serv.atualizar(req.params.id, req.body, req.usuarioId);
      if (!t) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
      res.status(200).json(t);
    } catch (error) {
      res.status(400).json({ error: error.message || "Dados inválidos" });
    }
  },

  async deletar(req, res) {
    try {
      const t = await serv.deletar(req.params.id, req.usuarioId);
      if (!t) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar tarefa" });
    }
  }
};
