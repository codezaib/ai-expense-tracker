import { Request, Response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../database/connect.js";
import { checkAndCreateAlerts } from "./alert.controller.js";

export const getExpenses = asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const {
    category_id,
    start,
    end,
    sort_by = "date",
    order = "desc",
    search = "",
  } = req.query;

  // Build orderBy
  const orderByMap: Record<string, object> = {
    date: { date: order },
    amount: { amount: order },
    category: { categories: { name: order } },
  };

  const orderBy = orderByMap[sort_by as string] ?? { date: "desc" };

  const expenses = await prisma.expenses.findMany({
    where: {
      user_id: userId,
      ...(category_id && { category_id: Number(category_id) }),
      ...(start || end
        ? {
            date: {
              ...(start && { gte: new Date(start as string) }),
              ...(end && { lte: new Date(end as string) }),
            },
          }
        : {}),
      ...(search && {
        categories: {
          name: { contains: search as string, mode: "insensitive" },
        },
      }),
    },
    include: { categories: true },
    orderBy,
  });

  return res.status(StatusCodes.OK).json({ expenses });
});

export const addExpense = asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { category_id, amount, note, date } = req.body;

  const expense = await prisma.expenses.create({
    data: {
      user_id: userId,
      category_id: category_id ?? null,
      amount,
      note: note ?? null,
      date: date ? new Date(date) : undefined,
    },
    include: { categories: true },
  });
  await checkAndCreateAlerts(userId, category_id, amount);
  return res.status(StatusCodes.CREATED).json({ expense });
});

export const updateExpense = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const expenseId = Number(req.params.id);
    const { category_id, amount, note, date } = req.body;

    const existing = await prisma.expenses.findFirst({
      where: { id: expenseId, user_id: userId },
    });

    if (!existing) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Expense not found" });
    }

    const expense = await prisma.expenses.update({
      where: { id: expenseId },
      data: {
        ...(category_id !== undefined && { category_id }),
        ...(amount !== undefined && { amount }),
        ...(note !== undefined && { note }),
        ...(date !== undefined && { date: new Date(date) }),
      },
      include: { categories: true },
    });
    await checkAndCreateAlerts(userId, category_id, amount);
    return res.status(StatusCodes.OK).json({ expense });
  },
);

export const deleteExpense = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const expenseId = Number(req.params.id);

    const existing = await prisma.expenses.findFirst({
      where: { id: expenseId, user_id: userId },
    });

    if (!existing) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Expense not found" });
    }

    await prisma.expenses.delete({ where: { id: expenseId } });

    return res.status(StatusCodes.OK).json({ message: "Expense deleted" });
  },
);

// GET /expenses/trend?days=30  (max 90)
export const getSpendingTrend = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const days = Math.min(Number(req.query.days) || 30, 90);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const expenses = await prisma.expenses.findMany({
      where: { user_id: userId, date: { gte: since } },
      select: { date: true, amount: true },
      orderBy: { date: "asc" },
    });

    // Group by date
    const trend = expenses.reduce<Record<string, number>>((acc, e) => {
      const key = e.date.toISOString().split("T")[0];
      acc[key] = (acc[key] || 0) + Number(e.amount);
      return acc;
    }, {});

    const result = Object.entries(trend).map(([date, total]) => ({
      date,
      total,
    }));

    return res.status(StatusCodes.OK).json({ days, trend: result });
  },
);
