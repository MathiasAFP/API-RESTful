const serv = require("../services/tarefas.services");

module.exports = {
  async listar(req, res) {
    res.json(await serv.listar());
  },

  async criar(req, res) {
    const tarefa = await serv.criar(req.body);
    res.status(201).json(tarefa);
  },

  async atualizar(req, res) {
    const t = await serv.atualizar(req.params.id, req.body.status);
    if (!t) return res.status(404).json({ message: "Tarefa não encontrada" });

    res.json(t);
  },

  async deletar(req, res) {
    const t = await serv.deletar(req.params.id);
    if (!t) return res.status(404).json({ message: "Tarefa não encontrada" });

    res.json({ message: "Tarefa deletada" });
  }
};
