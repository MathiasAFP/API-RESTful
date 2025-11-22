const mongoose = require("mongoose");

const tarefasSchema = new mongoose.Schema({
  titulo: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Tarefas", tarefasSchema);
