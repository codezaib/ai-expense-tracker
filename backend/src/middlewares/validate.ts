// middleware/validate.ts
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../errors/index.js";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestError(result.error.message);
    }
    (req as any).body = result.data;
    next();
  };
