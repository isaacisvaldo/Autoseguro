import { Request, Response } from 'express';

import { errorResponse, successResponse } from '../../handler/responseHandler';

export class HomeController {
  // constructor(private readonly adminService: AdminService ) {
  //   console.log('AdminController constructor - adminService:', this.adminService);
  // }

  async index(req: Request, res: Response, ): Promise<unknown> {
    try { 
        res.render("index",{info:req.flash('info'),certo:req.flash('certo'),errado:req.flash('errado')})
 
    } catch (error) {
      console.log(error);
      return errorResponse(res,'Server Error',500)  
    }
  }

  
}
