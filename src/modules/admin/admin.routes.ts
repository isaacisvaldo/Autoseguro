import { Router } from "express";
import  {AdminController}  from './controller/admin.controller'; 
import { AdminService } from './service/admin.service';
import { createAdminValidationRules, validate } from "./validation/admin.validation";
import { AdminRepository } from "./repository/admin.repository";

const admimRepository = new AdminRepository()
const adminService = new AdminService(admimRepository); 
const adminController = new AdminController(adminService); 


const adminRouter = Router()
/**
 * @swagger
 * /admin/createAdmin:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gelson Mesquita"
 *               email:
 *                 type: string
 *                 example: "email@example.com"
 *               nif:
 *                 type: string
 *                 example: "123456789"
 *               phone:
 *                 type: string
 *                 example: "(+244) 930333042"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *               accessLevelId:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               avatarUrl:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 */
adminRouter.post('/createAdmin',createAdminValidationRules(),validate, adminController.createAdmin.bind(adminController))
/**
 * @swagger
 * /admin/findAlladmin:
 *   get:
 *     summary: list all admin
 *     tags: [Admin]
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 */

adminRouter.get('/findAlladmin', adminController.findAlladmin.bind(adminController))
adminRouter.get('/findAlladmin', adminController.findAlladmin.bind(adminController))
export default adminRouter;