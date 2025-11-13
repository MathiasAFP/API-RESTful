import mongoose from "mongoose";


const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("usuario", usuarioSchema);