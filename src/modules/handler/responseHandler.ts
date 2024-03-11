import { Response } from 'express';

   export const successResponse = (res:Response, data:any, message:any,statusCode:number) => {
    return res.status(statusCode).json({ success: true, data, message });
  };
  
  export const errorResponse = (res:Response, message:any, statusCode:number) => {
    return res.status(statusCode).json({ success: false, message });
  };
  