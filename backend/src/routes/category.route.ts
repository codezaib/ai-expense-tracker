import { Router } from "express";
const router = Router();
import {
  createCategory,
  getCategories,
  editCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { categorySchema } from "../utils/validationSchemas.js";
import { validate } from "../middlewares/validate.js";
router.get("/", getCategories);
router.post("/", validate(categorySchema), createCategory);
router.patch("/:id", validate(categorySchema), editCategory);
router.delete("/:id", deleteCategory);

export default router;
