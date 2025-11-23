const Projetos = require("../models/projetos.model");

module.exports = {
  async listar(usuarioId) {
    return await Projetos.find({ usuarioId });
  },

  async criar({ nome, descricao, usuarioId }) {
    return await Projetos.create({ nome, descricao, usuarioId });
  },

  async atualizar(id, usuarioId, { nome, descricao }) {
    return await Projetos.findOneAndUpdate(
      { _id: id, usuarioId },
      { nome, descricao },
      { new: true }
    );
  },

  async deletar(id, usuarioId) {
    return await Projetos.findOneAndDelete({ _id: id, usuarioId });
  }
};
