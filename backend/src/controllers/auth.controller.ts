import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { prisma } from "../database/connect.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userAlreadyExists = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  if (userAlreadyExists) throw new BadRequestError("Email already in use");
  const hashedPassword = await hashPassword(password);
  const user = await prisma.users.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });
  attachCookiesToResponse(res, user);
  return res.status(StatusCodes.CREATED).json({
    user,
  });
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new UnAuthenticatedError("Invalid credentials");
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) throw new UnAuthenticatedError("Invalid credentials");
  attachCookiesToResponse(res, user);
  return res.status(StatusCodes.OK).json({
    user,
  });
});

export const getUserProfile = asyncWrapper(
  async (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({
      user: (req as any).user,
    });
  },
);

export const logout = asyncWrapper(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(StatusCodes.OK).json({
    message: "Logged out successfully",
  });
});
