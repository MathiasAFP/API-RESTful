const { tokens } = require("../services/usuario.services");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Não autorizado" });

  const token = header.split(" ")[1];

  if (!tokens[token]) {
    return res.status(401).json({ message: "Token inválido" });
  }

  req.usuarioId = tokens[token];
  next();
};
