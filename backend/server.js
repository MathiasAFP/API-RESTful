const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuario", require("./routes/usuario.routes"));
app.use("/projetos", require("./routes/projetos.routes"));
app.use("/tarefas", require("./routes/tarefas.routes"));
app.use("/membros", require("./routes/membros.routes"));

// Conexão MongoDB
mongoose.connect(process.env.MONGOKEY)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log("Erro ao conectar Mongo:", err));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
