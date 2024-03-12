import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../../handler/responseHandler';


export const loginRules = () => {
  return [ 
    body('email')
      .notEmpty()
      .withMessage('O email não pode estar vazio')
      .bail()
      .isEmail()
      .withMessage('O email deve ser válido'),
    body('password')
      .isString()
      .withMessage('Adicione um senha valido e Forte'),
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorMessages = errors.array().map(error => error.msg);
 
  return  errorResponse(res,errorMessages,400)
};