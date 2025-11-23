const Tarefas = require("../models/tarefas.model");

module.exports = {
  async listar() {
    return await Tarefas.find().populate("membroId", "nome");
  },

  async criar({ titulo, status, membroId }) {
    const tarefa = await Tarefas.create({ titulo, status, membroId });
    return await Tarefas.findById(tarefa._id).populate("membroId", "nome");
  },

  async atualizar(id, status) {
    return await Tarefas.findByIdAndUpdate(id, { status }, { new: true }).populate("membroId", "nome");
  },

  async deletar(id) {
    return await Tarefas.findByIdAndDelete(id);
  }
};
