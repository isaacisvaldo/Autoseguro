import { Router } from "express";
import  {HomeController}  from './controller/home.controller'; 



const homeController = new HomeController(); 


const homeRoute = Router()
homeRoute.get('', homeController.index)
export default homeRoute;