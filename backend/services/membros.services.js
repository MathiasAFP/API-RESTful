const Membros = require("../models/membros.models");
const Projetos = require("../models/projetos.model");
const Tarefas = require("../models/tarefas.model");

module.exports = {
  
  async listar(usuarioId) {
 
    const projetos = await Projetos.find({ usuarioId }).select("_id");
    const ids = projetos.map(p => p._id);


    const membros = await Membros.find({ projetoId: { $in: ids } })
      .populate("projetoId", "nome");


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


  async buscarPorId(id, usuarioId) {
    const membro = await Membros.findById(id).populate("projetoId", "nome");
    if (!membro) return null;

    const projeto = await Projetos.findOne({ _id: membro.projetoId._id, usuarioId });
    if (!projeto) return null;


    const tarefas = await Tarefas.find({ membroId: membro._id })
      .select("titulo descricao status");

    return {
      ...membro.toObject(),
      tarefas
    };
  },

  async criar({ nome, projetoId, usuarioId }) {
 
    if (!nome || !nome.trim()) {
      throw new Error("Nome é obrigatório");
    }

    const projeto = await Projetos.findOne({ _id: projetoId, usuarioId });
    if (!projeto) {
      throw new Error("Projeto não encontrado ou não pertence ao usuário");
    }

    return await Membros.create({ nome: nome.trim(), projetoId });
  },

  async atualizar(id, dados, usuarioId) {
    const membro = await Membros.findById(id).populate("projetoId");
    if (!membro) return null;

    const projeto = await Projetos.findOne({ _id: membro.projetoId._id, usuarioId });
    if (!projeto) return null;

    const updateData = {};

    if (dados.nome !== undefined) {
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error("Nome não pode ser vazio");
      }
      updateData.nome = dados.nome.trim();
    }

    if (dados.projetoId !== undefined) {
 
      const novoProjeto = await Projetos.findOne({ _id: dados.projetoId, usuarioId });
      if (!novoProjeto) {
        throw new Error("Projeto não encontrado ou não pertence ao usuário");
      }
      updateData.projetoId = dados.projetoId;
    }

    return await Membros.findByIdAndUpdate(id, updateData, { new: true })
      .populate("projetoId", "nome");
  },

  async deletar(id, usuarioId) {
    const membro = await Membros.findById(id).populate("projetoId");
    if (!membro) return null;

    const projeto = await Projetos.findOne({ _id: membro.projetoId._id, usuarioId });
    if (!projeto) return null;

    return await Membros.findByIdAndDelete(id);
  }
};
