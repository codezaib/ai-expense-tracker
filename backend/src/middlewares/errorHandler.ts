import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  try {
    const parsed = JSON.parse(message);
    if (Array.isArray(parsed)) {
      return res.status(statusCode).json({
        errors: parsed.map((e: any) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }
  } catch {
    // not JSON, use as-is
  }
  return res.status(statusCode).json({ msg: message });
};

export default errorHandler;
