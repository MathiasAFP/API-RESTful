import mongoose from "mongoose";

const tarefasSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  status: { type: String, enum: ["Pendente", "Em Andamento", "Concluída"], default: "Pendente" },
  prioridade: { type: String, enum: ["Baixa", "Média", "Alta"], default: "Média" },
  projetoId: { type: mongoose.Schema.Types.ObjectId, ref: "Projeto" },
  criadoEm: { type: Date, default: Date.now },
  concluidoEm: Date
});

export default mongoose.model("Tarefas", tarefasSchema);