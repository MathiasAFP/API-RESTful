const serv = require("../services/membros.services");

module.exports = {
  async listar(req, res) {
    const membros = await serv.listar(req.usuarioId);
    res.json(membros);
  },

  async criar(req, res) {
    const criado = await serv.criar({
      nome: req.body.nome,
      projetoId: req.body.projetoId,
      usuarioId: req.usuarioId
    });

    if (!criado) return res.status(404).json({ message: "Projeto não encontrado" });

    res.status(201).json(criado);
  },

  async deletar(req, res) {
    const d = await serv.deletar(req.params.id);
    if (!d) return res.status(404).json({ message: "Membro não encontrado" });

    res.json({ message: "Membro deletado" });
  }
};
