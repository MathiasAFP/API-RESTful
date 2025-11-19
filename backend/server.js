const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGOKEY)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log("Erro ao conectar Mongo:", err));

app.use("/projetos", require("./routes/projetos.routes"));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
