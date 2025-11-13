import mongoose, { Schema } from "mongoose";

const projetosSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  status: { type: String, enum: ["Planejado", "Em Andamento", "Concluído"], default: "Planejado" },
  prazo: Date,
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("projetos", projetosSchema)