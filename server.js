import express from "express";
import { router } from "./routes/associado_rotas.js";

const server = express();

server.use(express.json());
server.use("/", router);

server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});