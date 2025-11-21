const mongoose = require("mongoose");

const tarefasSchema = new mongoose.Schema({
  titulo: String,
  projeto: { type: mongoose.Schema.Types.ObjectId, ref: "Projetos" },
  status: { type: String, enum: ["Pendente", "Em Andamento", "Concluída"], default: "Pendente" },
  prioridade: { type: String, enum: ["Baixa", "Média", "Alta"], default: "Média" },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tarefas", tarefasSchema);
