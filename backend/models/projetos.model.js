const mongoose = require("mongoose");

const projetosSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
});

module.exports = mongoose.model("Projetos", projetosSchema);
