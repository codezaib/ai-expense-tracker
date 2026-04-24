// controllers/category.controller.ts
import { Request, Response } from "express";
import { prisma } from "../database/connect.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";

// GET /api/v1/categories
export const getCategories = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const categories = await prisma.categories.findMany({
      where: { user_id: userId },
      include: {
        budgets: {
          where: { month: currentMonth, year: currentYear },
        },
      },
    });

    return res.status(StatusCodes.OK).json({ categories });
  },
);

export const createCategory = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { name, budget } = req.body;

    const category = await prisma.categories.create({
      data: { name, user_id: userId },
    });

    if (budget) {
      await prisma.budgets.create({
        data: {
          user_id: userId,
          category_id: category.id,
          amount: budget,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
      });
    }

    const result = await prisma.categories.findUnique({
      where: { id: category.id },
      include: { budgets: true },
    });

    return res.status(StatusCodes.CREATED).json({ category: result });
  },
);

// editCategory
export const editCategory = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { name, budget } = req.body;

    const exists = await prisma.categories.findFirst({
      where: { id: Number(id), user_id: userId, is_default: false },
    });
    if (!exists) throw new NotFoundError("Category not found or not editable");

    if (budget) {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      const existingBudget = await prisma.budgets.findFirst({
        where: { user_id: userId, category_id: Number(id), month, year },
      });

      existingBudget
        ? await prisma.budgets.update({
            where: { id: existingBudget.id },
            data: { amount: budget },
          })
        : await prisma.budgets.create({
            data: {
              user_id: userId,
              category_id: Number(id),
              amount: budget,
              month,
              year,
            },
          });
    }

    const category = await prisma.categories.update({
      where: { id: Number(id) },
      data: { ...(name && name !== exists.name && { name }) },
      include: { budgets: true },
    });

    return res.status(StatusCodes.OK).json({ category });
  },
);

export const deleteCategory = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const exists = await prisma.categories.findFirst({
      where: { id: Number(id), user_id: userId, is_default: false },
    });
    if (!exists) throw new NotFoundError("Category not found or not deletable");

    await prisma.categories.delete({ where: { id: Number(id) } });

    return res.status(StatusCodes.OK).json({ message: "Category deleted" });
  },
);
