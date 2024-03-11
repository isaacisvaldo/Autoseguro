import { Router } from "express";
import userRouter from "../modules/students/user.routes";
import funcionarioRouter from "../modules/instructor/instructor.routes";
import adminRouter from "../modules/admin/admin.routes";

const routes = Router()
routes.use('/user',userRouter)
routes.use('/funcionario',funcionarioRouter)
routes.use('/admin',adminRouter)



export {routes}; 