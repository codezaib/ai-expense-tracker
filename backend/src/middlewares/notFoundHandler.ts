import { Request, Response, NextFunction } from "express";
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ msg: "Route not found" });
};

export default notFoundHandler;
