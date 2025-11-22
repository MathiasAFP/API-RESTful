const mongoose = require("mongoose");

const membrosSchema = new mongoose.Schema({
  nome: String,
  projetoId: { type: mongoose.Schema.Types.ObjectId, ref: "Projetos" }
});

module.exports = mongoose.model("Membros", membrosSchema);
