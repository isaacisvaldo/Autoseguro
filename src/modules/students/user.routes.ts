import { Router } from "express";
import * as studentsController from './controller/students.controller';
const userRouter = Router()


userRouter.get('/home',studentsController.dasboard)

export default userRouter;