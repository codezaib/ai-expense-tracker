import { Request, Response } from "express";
import { prisma } from "../database/connect.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/sendEmails.js";

const trySendEmail = (to: string, subject: string, html: string) => {
  if (!to) return;
  sendEmail(to, subject, html).catch(() => {});
};

export const checkAndCreateAlerts = async (
  userId: number,
  categoryId: number | null,
  amount: number,
) => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const monthStart = new Date(year, month - 1, 1);

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user?.email) return;

  // MONTHLY BUDGET CHECK
  const totalSpent = await prisma.expenses.aggregate({
    where: { user_id: userId, date: { gte: monthStart } },
    _sum: { amount: true },
  });

  const monthlyBudget = await prisma.budgets.findFirst({
    where: { user_id: userId, category_id: null, month, year },
  });

  if (monthlyBudget) {
    const spent = Number(totalSpent._sum.amount || 0);
    const limit = Number(monthlyBudget.amount);
    const percent = (spent / limit) * 100;

    if (percent >= 100) {
      await prisma.alerts.create({
        data: {
          user_id: userId,
          type: "exceeded",
          message: `You have exceeded your monthly budget of ${limit}. You spent ${Math.round(percent)}% of the limit.`,
        },
      });
      trySendEmail(
        user.email,
        "Budget Alert: Monthly Budget Exceeded",
        `<p>You have exceeded your monthly budget of ${limit}. You spent ${Math.round(percent)}% of the limit.</p>`,
      );
    } else if (percent >= 80) {
      await prisma.alerts.create({
        data: {
          user_id: userId,
          type: "near_limit",
          message: `You have used ${Math.round(percent)}% of your monthly budget.`,
        },
      });
      trySendEmail(
        user.email,
        "Budget Alert: Monthly Budget",
        `<p>You have used ${Math.round(percent)}% of your monthly budget of ${limit}.</p>`,
      );
    }
  }

  // CATEGORY BUDGET CHECK
  if (categoryId) {
    const categorySpent = await prisma.expenses.aggregate({
      where: {
        user_id: userId,
        category_id: categoryId,
        date: { gte: monthStart },
      },
      _sum: { amount: true },
    });

    const categoryBudget = await prisma.budgets.findFirst({
      where: { user_id: userId, category_id: categoryId, month, year },
    });

    if (categoryBudget) {
      const spent = Number(categorySpent._sum.amount || 0);
      const limit = Number(categoryBudget.amount);
      const percent = (spent / limit) * 100;

      const category = await prisma.categories.findUnique({
        where: { id: categoryId },
        select: { name: true },
      });
      const categoryName = category?.name ?? "Unknown";

      if (percent >= 100) {
        await prisma.alerts.create({
          data: {
            user_id: userId,
            type: "exceeded",
            message: `You have exceeded your "${categoryName}" category budget of ${limit}. You spent ${Math.round(percent)}% of the limit.`,
          },
        });
        trySendEmail(
          user.email,
          `Budget Alert: ${categoryName} Category Exceeded`,
          `<p>You have exceeded your "${categoryName}" category budget of ${limit}. You spent ${Math.round(percent)}% of the limit.</p>`,
        );
      } else if (percent >= 80) {
        await prisma.alerts.create({
          data: {
            user_id: userId,
            type: "near_limit",
            message: `You have used ${Math.round(percent)}% of your "${categoryName}" category budget of ${limit}.`,
          },
        });
        trySendEmail(
          user.email,
          `Budget Alert: ${categoryName} Category`,
          `<p>You have used ${Math.round(percent)}% of your "${categoryName}" category budget of ${limit}.</p>`,
        );
      }
    }
  }

  // UNUSUAL EXPENSE CHECK
  const avgExpense = await prisma.expenses.aggregate({
    where: { user_id: userId, date: { gte: monthStart } },
    _avg: { amount: true },
    _count: true,
  });

  if (avgExpense._count >= 5) {
    const avg = Number(avgExpense._avg.amount || 0);
    if (amount > avg * 3) {
      await prisma.alerts.create({
        data: {
          user_id: userId,
          type: "unusual",
          message: `Unusual expense detected: ${amount} is 3x your average expense of ${Math.round(avg)}.`,
        },
      });
      trySendEmail(
        user.email,
        "Unusual Expense Detected",
        `<p>A new unusual expense has been detected:</p><p><strong>Amount:</strong> ${amount}</p><p><strong>Average:</strong> ${Math.round(avg)}</p>`,
      );
    }
  }
};

export const getAlerts = asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { filter } = req.query as { filter?: string };
  if (filter && !["all", "unread"].includes(filter)) {
    throw new BadRequestError("Invalid filter value");
  }
  const alerts = await prisma.alerts.findMany({
    where: {
      user_id: userId,
      ...(filter === "unread" ? { is_read: false } : {}),
    },
    orderBy: { created_at: "desc" },
  });
  res.status(StatusCodes.OK).json({ alerts });
});

export const markAlertAsRead = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const alertId = Number(req.params.id);
    const alert = await prisma.alerts.findUnique({
      where: { id: alertId, user_id: userId },
    });
    if (!alert) throw new NotFoundError("Alert not found");
    await prisma.alerts.update({
      where: { id: alertId, user_id: userId },
      data: { is_read: true },
    });
    res.status(StatusCodes.OK).json({ message: "Alert marked as read" });
  },
);

export const markAllAlertsAsRead = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await prisma.alerts.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
    res.status(StatusCodes.OK).json({ message: "All alerts marked as read" });
  },
);

export const deleteAlert = asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const alertId = Number(req.params.id);
  const alert = await prisma.alerts.findUnique({
    where: { id: alertId, user_id: userId },
  });
  if (!alert) throw new NotFoundError("Alert not found");
  await prisma.alerts.delete({ where: { id: alertId, user_id: userId } });
  res.status(StatusCodes.OK).json({ message: "Alert deleted" });
});
