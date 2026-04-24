import { Request, Response, NextFunction } from "express";
import { isTokenValid } from "../utils/jwt.js";
import { UnAuthenticatedError } from "../errors/index.js";
const authHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies?.token;
  if (!token) {
    throw new UnAuthenticatedError("Access denied. No token provided.");
  }
  try {
    const decoded = isTokenValid(token);
    (req as any).user = decoded["payload"];
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Invalid token.");
  }
};
export default authHandler;
