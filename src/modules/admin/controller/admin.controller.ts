import { Request, Response } from 'express';
import { AdminService } from './../service/admin.service';
import { errorResponse, successResponse } from '../../handler/responseHandler';
import { autenticationService } from '../../../utils/authentication/authentication';

export class AdminController {
  constructor(private readonly adminService: AdminService ) {
    console.log('AdminController constructor - adminService:', this.adminService);
  }

  async createAdmin(req: Request, res: Response, ): Promise<unknown> {
    try { 
      const newRequest ={ ...req.body,password:await autenticationService.encryptPassword(req.body.password)}
       const createdAdmin = await this.adminService.create(newRequest);
      return successResponse(res,createdAdmin,'Admin cadastrado com sucesso',201);
    } catch (error) {
      console.log(error);
      return errorResponse(res,'Server Error',500)  
    }
  }
  async findAlladmin(req: Request, res: Response, ): Promise<unknown> {
    try { 
      return successResponse(res,await this.adminService.findAll(),'',200);
    } catch (error) {
      console.log(error);
      return errorResponse(res,'Server Error',500)  
    }
  }
  async updateAdmin (req: Request, res: Response, ): Promise<unknown> {
    try {
      const { id } = req.params;
   
      const updateAdmin = await this.adminService.update(parseInt(id, 10),req.body);
      return successResponse(res,updateAdmin,'Admin Atualizado com sucesso',200);
    } catch (error) {
      console.log(error);
      return errorResponse(res,'Server Error',500)   
    }
  }
  async deleteAdmin (req: Request, res: Response, ): Promise<unknown> {
    try {
      const { id } = req.params;
   
      const updateAdmin = await this.adminService.update(parseInt(id, 10),req.body);
      return successResponse(res,updateAdmin,'Admin Atualizado com sucesso',200);
    } catch (error) {
      console.log(error);
      return errorResponse(res,'Server Error',500)   
    }
  }
  
}
