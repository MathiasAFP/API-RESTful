const Tarefas = require("../models/tarefas.model");
const Membros = require("../models/membros.models");
const mongoose = require("mongoose");

module.exports = {
  async listar() {
    return await Tarefas.find()
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
  },

  async criar({ titulo, descricao, status, membroId }) {
    const tarefaData = { titulo, status };
    if (descricao && descricao.trim()) tarefaData.descricao = descricao.trim();
    
    // Validar e converter membroId para ObjectId se necessário
    if (membroId) {
      const membroIdStr = membroId.toString().trim();
      if (membroIdStr !== '' && mongoose.Types.ObjectId.isValid(membroIdStr)) {
        // Verificar se o membro existe antes de atribuir
        const membro = await Membros.findById(membroIdStr);
        if (membro) {
          tarefaData.membroId = new mongoose.Types.ObjectId(membroIdStr);
        }
      }
    }
    
    const tarefa = await Tarefas.create(tarefaData);
    
    // Fazer populate imediatamente após criar
    const tarefaPopulada = await Tarefas.findById(tarefa._id)
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
    
    return tarefaPopulada;
  },

  async atualizar(id, status) {
    return await Tarefas.findByIdAndUpdate(id, { status }, { new: true })
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
  },

  async deletar(id) {
    return await Tarefas.findByIdAndDelete(id);
  }
};
