const Tarefas = require("../models/tarefas.model");

module.exports = {
  async listar() {
    return await Tarefas.find();
  },

  async criar({ titulo, status }) {
    return await Tarefas.create({ titulo, status });
  },

  async atualizar(id, status) {
    return await Tarefas.findByIdAndUpdate(id, { status }, { new: true });
  },

  async deletar(id) {
    return await Tarefas.findByIdAndDelete(id);
  }
};
