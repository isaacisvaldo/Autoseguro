import { Router } from "express";
import  {HomeController}  from './controller/home.controller'; 
import { loginRules ,validate} from "./validation/validation";



const homeController = new HomeController(); 


const homeRoute = Router()
homeRoute.get('/', homeController.index)
homeRoute.get('/login', homeController.formlogin)
homeRoute.post('/authenticate', loginRules,validate, homeController.login)
export default homeRoute;