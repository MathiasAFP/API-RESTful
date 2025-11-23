const Tarefas = require("../models/tarefas.model");

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
    if (descricao) tarefaData.descricao = descricao;
    if (membroId) tarefaData.membroId = membroId;
    
    const tarefa = await Tarefas.create(tarefaData);
    return await Tarefas.findById(tarefa._id)
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
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
