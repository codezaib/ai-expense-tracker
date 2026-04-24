import { Response, Request } from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { prisma } from "../database/connect.js";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
// POST /api/v1/budgets/monthly
export const setMonthlyBudget = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { amount, month, year } = req.body;
    const m = !month ? new Date().getMonth() + 1 : month;
    const y = !year ? new Date().getFullYear() : year;

    const existing = await prisma.budgets.findFirst({
      where: { user_id: userId, category_id: null, month: m, year: y },
    });

    const budget = existing
      ? await prisma.budgets.update({
          where: { id: existing.id },
          data: { amount },
        })
      : await prisma.budgets.create({
          data: {
            user_id: userId,
            amount,
            category_id: null,
            month: m,
            year: y,
          },
        });

    return res.status(StatusCodes.OK).json({ budget });
  },
);

export const getMonthlyBudgets = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const months = Math.min(Number(req.query.months) || 1, 6); // cap at 6
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const budgets = await prisma.$queryRaw`
    SELECT 
      b.id,
      b.amount AS limit,
      b.month,
      b.year,
      COALESCE(SUM(e.amount), 0) AS spent,
      (GREATEST(b.amount - COALESCE(SUM(e.amount), 0), 0)) AS remaining,
      (COALESCE(SUM(e.amount), 0) / NULLIF(b.amount, 0)) * 100 AS percent_spent
    FROM budgets b
    LEFT JOIN expenses e
      ON e.user_id = b.user_id
      AND EXTRACT(MONTH FROM e.date) = b.month
      AND EXTRACT(YEAR FROM e.date) = b.year
    WHERE b.user_id = ${userId}
      AND b.category_id IS NULL
      AND (b.year * 12 + b.month) > (${currentYear} * 12 + ${currentMonth} - ${months})
      AND (b.year * 12 + b.month) <= (${currentYear} * 12 + ${currentMonth})
    GROUP BY b.id
    ORDER BY b.year DESC, b.month DESC
    LIMIT ${months}
  `;

    return res.status(StatusCodes.OK).json({ budgets });
  },
);

export const getCategoryBudgets = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const budgets = await prisma.$queryRaw`
    SELECT 
    b.id,
      c.name AS category,
      c.id AS category_id,
      b.amount AS limit,
      b.month,
      b.year,
      COALESCE(SUM(e.amount), 0) AS spent,
      (GREATEST(b.amount - COALESCE(SUM(e.amount), 0), 0)) AS remaining,
      (COALESCE(SUM(e.amount), 0) / NULLIF(b.amount, 0)) * 100 AS percent_spent
      FROM budgets b
      JOIN categories c ON c.id = b.category_id
      LEFT JOIN expenses e
      ON e.user_id = b.user_id
      AND e.category_id = b.category_id
      AND EXTRACT(MONTH FROM e.date) = ${month}
      AND EXTRACT(YEAR FROM e.date) = ${year}
      WHERE b.user_id = ${userId}
      AND b.category_id IS NOT NULL
      AND b.month = ${month}
      AND b.year = ${year}
      GROUP BY b.id, c.id
      ORDER BY spent DESC
      `;

    return res.status(StatusCodes.OK).json({ budgets });
  },
);
