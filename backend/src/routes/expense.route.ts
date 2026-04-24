// routes/expenses.ts
import { Router } from "express";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getSpendingTrend,
} from "../controllers/expense.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  addExpenseSchema,
  updateExpenseSchema,
} from "../utils/validationSchemas.js";

const router = Router();

router.get("/", getExpenses);
router.post("/", validate(addExpenseSchema), addExpense);
router.patch("/:id", validate(updateExpenseSchema), updateExpense);
router.delete("/:id", deleteExpense);
router.get("/trend", getSpendingTrend);

export default router;
