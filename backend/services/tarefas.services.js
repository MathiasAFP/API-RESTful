const Tarefas = require("../models/tarefas.model");
const Membros = require("../models/membros.models");
const mongoose = require("mongoose");

module.exports = {
  async listar(usuarioId) {
    return await Tarefas.find({ usuarioId })
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
  },

  async buscarPorId(id, usuarioId) {
    return await Tarefas.findOne({ _id: id, usuarioId })
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
  },

  async criar({ titulo, descricao, status, membroId, usuarioId }) {

    if (!titulo || !titulo.trim()) {
      throw new Error("Título é obrigatório");
    }

    const tarefaData = { titulo: titulo.trim(), usuarioId };
    
    if (descricao && descricao.trim()) {
      tarefaData.descricao = descricao.trim();
    }
    
    if (status) {
      tarefaData.status = status;
    }
    
    if (membroId) {
      const membroIdStr = membroId.toString().trim();
      if (membroIdStr !== '' && mongoose.Types.ObjectId.isValid(membroIdStr)) {

        const membro = await Membros.findById(membroIdStr);
        if (membro) {
          tarefaData.membroId = new mongoose.Types.ObjectId(membroIdStr);
        }
      }
    }
    
    const tarefa = await Tarefas.create(tarefaData);
    
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

  async atualizar(id, dados, usuarioId) {
    const updateData = {};
    
    if (dados.titulo !== undefined) {
      if (!dados.titulo || !dados.titulo.trim()) {
        throw new Error("Título não pode ser vazio");
      }
      updateData.titulo = dados.titulo.trim();
    }
    
    if (dados.descricao !== undefined) {
      updateData.descricao = dados.descricao ? dados.descricao.trim() : null;
    }
    
    if (dados.status !== undefined) {
      updateData.status = dados.status;
    }
    
    if (dados.membroId !== undefined) {
      if (dados.membroId) {
        const membroIdStr = dados.membroId.toString().trim();
        if (membroIdStr !== '' && mongoose.Types.ObjectId.isValid(membroIdStr)) {
          const membro = await Membros.findById(membroIdStr);
          if (membro) {
            updateData.membroId = new mongoose.Types.ObjectId(membroIdStr);
          }
        }
      } else {
        updateData.membroId = null;
      }
    }
    
    return await Tarefas.findOneAndUpdate({ _id: id, usuarioId }, updateData, { new: true })
      .populate({
        path: "membroId",
        select: "nome projetoId",
        populate: {
          path: "projetoId",
          select: "nome"
        }
      });
  },

  async deletar(id, usuarioId) {
    return await Tarefas.findOneAndDelete({ _id: id, usuarioId });
  }
};
