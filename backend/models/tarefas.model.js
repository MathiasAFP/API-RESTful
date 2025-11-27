const mongoose = require("mongoose");

const tarefasSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  status: { type: String, default: "pending" },
  membroId: { type: mongoose.Schema.Types.ObjectId, ref: "Membros" },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
});

module.exports = mongoose.model("Tarefas", tarefasSchema);
