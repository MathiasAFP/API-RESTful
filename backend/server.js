import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const app = express();
const PORT = 3000;



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOKEY);
        console.log("Conectado No Banco");
    } catch (error) {
        console.log("Deu erro na conexão do banco", error)
    }
};

connectDB();

app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));