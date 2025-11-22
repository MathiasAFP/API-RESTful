const Usuario = require("../models/usuario.model");
const crypto = require("crypto");

const tokens = {};

function gerarToken(id) {
  const t = crypto.randomBytes(20).toString("hex");
  tokens[t] = id;
  return t;
}

module.exports = {
  async registrar({ nome, email, senha }) {
    const existe = await Usuario.findOne({ email });
    if (existe) return null;

    const usuario = await Usuario.create({ nome, email, senha });
    const token = gerarToken(usuario._id);

    return { usuario, token };
  },

  async login(email, senha) {
    const usuario = await Usuario.findOne({ email, senha });
    if (!usuario) return null;

    const token = gerarToken(usuario._id);

    return { usuario, token };
  },

  tokens
};
