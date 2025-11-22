const Membros = require("../models/membros.models");
const Projetos = require("../models/projetos.model");

module.exports = {
  async listar(usuarioId) {
    const projetos = await Projetos.find({ usuarioId }).select("_id");
    const ids = projetos.map(p => p._id);

    return await Membros.find({ projetoId: { $in: ids } }).populate("projetoId", "nome");
  },

  async criar({ nome, projetoId, usuarioId }) {
    const projeto = await Projetos.findOne({ _id: projetoId, usuarioId });
    if (!projeto) return null;

    return await Membros.create({ nome, projetoId });
  },

  async deletar(id) {
    return await Membros.findByIdAndDelete(id); 
  }
};
