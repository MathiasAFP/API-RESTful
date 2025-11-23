const Membros = require("../models/membros.models");
const Projetos = require("../models/projetos.model");
const Tarefas = require("../models/tarefas.model");

module.exports = {
  // LISTAR MEMBROS + SUAS TAREFAS
  async listar(usuarioId) {
    // Busca todos os projetos do usuário
    const projetos = await Projetos.find({ usuarioId }).select("_id");
    const ids = projetos.map(p => p._id);

    // Busca membros desses projetos
    const membros = await Membros.find({ projetoId: { $in: ids } })
      .populate("projetoId", "nome");

    // Para cada membro, busca as tarefas dele
    const membrosComTarefas = await Promise.all(
      membros.map(async (m) => {
        const tarefas = await Tarefas.find({ membroId: m._id })
          .select("titulo descricao status");

        return {
          ...m.toObject(),
          tarefas
        };
      })
    );

    return membrosComTarefas;
  },

  // CRIAR MEMBRO
  async criar({ nome, projetoId, usuarioId }) {
    // Validar se o projeto existe e pertence ao usuário
    const projeto = await Projetos.findOne({ _id: projetoId, usuarioId });
    if (!projeto) return null;

    return await Membros.create({ nome, projetoId });
  },

  // DELETAR MEMBRO
  async deletar(id) {
    return await Membros.findByIdAndDelete(id);
  }
};
