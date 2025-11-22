const express = require("express");
const router = express.Router();
const { Projeto } = require("../models/projetos.model");
// const projetoService  = require("../services/projetos.services");


router.post("/", async (req, res) => {
    try {
        const novoProjeto = new Projeto(req.body);
        const projetoSalvo = await novoProjeto.save();
        res.status(201).json(projetoSalvo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const projetos = await Projeto.find();
        res.status(200).json(projetos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar projetos" });
    }
});

module.exports = router;
