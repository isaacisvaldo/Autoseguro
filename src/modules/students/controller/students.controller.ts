import { Response, Request } from "express";


export async function dasboard(req: Request, res: Response) {
  try { /* empty */ } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create user." });
  }
}
