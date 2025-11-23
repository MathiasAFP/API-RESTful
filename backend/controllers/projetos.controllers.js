const serv = require("../services/projetos.services");

module.exports = {
  async listar(req, res) {
    const dados = await serv.listar(req.usuarioId);
    res.json(dados);
  },

  async criar(req, res) {
    const dados = await serv.criar({ ...req.body, usuarioId: req.usuarioId });
    res.status(201).json(dados);
  },

  async atualizar(req, res) {
    const atualizado = await serv.atualizar(req.params.id, req.usuarioId, req.body);
    if (!atualizado) return res.status(404).json({ message: "Projeto não encontrado" });

    res.json(atualizado);
  },

  async deletar(req, res) {
    const apagado = await serv.deletar(req.params.id, req.usuarioId);
    if (!apagado) return res.status(404).json({ message: "Projeto não encontrado" });

    res.json({ message: "Projeto deletado" });
  }
};
