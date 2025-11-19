const mongoose = require('mongoose');

const projetosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,
  status: { type: String, enum: ["Planejado", "Em Andamento", "Concluído"], default: "Planejado" },
  prazo: Date,
  criadoEm: { type: Date, default: Date.now }
});

const Projeto = mongoose.model('Projeto', projetosSchema);
module.exports = Projeto;
