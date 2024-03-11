import { Router } from "express";
import * as FuncionarioController  from "./controller/instructor.controller";
const funcionarioRouter = Router()


funcionarioRouter.get('/Listar',FuncionarioController.Funcionarios)


export default funcionarioRouter;