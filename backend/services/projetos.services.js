const Projetos = require("../models/projetos.model");

module.exports = {
  async listar(usuarioId) {
    return await Projetos.find({ usuarioId });
  },

  async buscarPorId(id, usuarioId) {
    return await Projetos.findOne({ _id: id, usuarioId });
  },

  async criar({ nome, descricao, usuarioId }) {

    if (!nome || !nome.trim()) {
      throw new Error("Nome é obrigatório");
    }
    return await Projetos.create({ nome: nome.trim(), descricao, usuarioId });
  },

  async atualizar(id, usuarioId, { nome, descricao }) {
    const updateData = {};
    
    if (nome !== undefined) {
      if (!nome || !nome.trim()) {
        throw new Error("Nome não pode ser vazio");
      }
      updateData.nome = nome.trim();
    }
    
    if (descricao !== undefined) {
      updateData.descricao = descricao ? descricao.trim() : null;
    }
    
    return await Projetos.findOneAndUpdate(
      { _id: id, usuarioId },
      updateData,
      { new: true }
    );
  },

  async deletar(id, usuarioId) {
    return await Projetos.findOneAndDelete({ _id: id, usuarioId });
  }
};
