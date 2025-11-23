const usuarioService = require("../services/usuario.services");

module.exports = {
  async registrar(req, res) {
    const result = await usuarioService.registrar(req.body);
    if (!result) return res.status(400).json({ message: "Usuário já existe" });

    res.status(201).json(result);
  },

  async login(req, res) {
    const result = await usuarioService.login(req.body.email, req.body.senha);
    if (!result) return res.status(401).json({ message: "Credenciais inválidas" });

    res.json(result);
  }
};
