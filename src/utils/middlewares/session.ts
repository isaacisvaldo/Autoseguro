import { Response, Request, NextFunction } from "express";
export async function userAuth(req: Request, resp: Response, next: NextFunction) {
    if (req.session?.user) {
        next();
      } else {
        resp.redirect("/");
      }
}
export async function sessionVerify(req: Request, resp: Response, next: NextFunction) {
  if (req.session?.user!= undefined) {
    resp.redirect('/Perfil')
    } else {
      next();
    }
}



