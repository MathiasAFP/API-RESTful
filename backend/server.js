const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const projetosRoutes = require("../backend/routes/projetos.routes");

app.use(express.json());
app.use("/projetos", projetosRoutes);

mongoose.connect(process.env.MONGOKEY)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log("Erro ao conectar Mongo:", err));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
