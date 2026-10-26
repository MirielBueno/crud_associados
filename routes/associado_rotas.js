import express from "express";
import associado from "../controller/associado_controller.js";

const router = express.Router();

// Cadastrar associado
router.post("/associados", associado.create);

// Listar associados
router.get("/associados", associado.all);

// Buscar por CPF
router.get("/associados/:cpf", associado.findByCpf);

// Atualizar associado
router.put("/associados/:cpf", associado.update);

// Exclusão lógica
router.delete("/associados/:cpf", associado.remove);

// Exclusão definitiva
router.delete("/associados/:cpf/permanente", associado.deletePermanent);

export { router };