import { Router } from "express";
const router = Router();
import {
  getMonthlyBudgets,
  getCategoryBudgets,
  setMonthlyBudget,
} from "../controllers/budget.controller.js";
import { validate } from "../middlewares/validate.js";
import { budgetSchema } from "../utils/validationSchemas.js";

router.get("/monthly", getMonthlyBudgets);
router.get("/categories", getCategoryBudgets);
router.post("/monthly", validate(budgetSchema), setMonthlyBudget);

export default router;
