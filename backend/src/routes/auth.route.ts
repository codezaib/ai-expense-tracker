import { Router } from "express";
const router = Router();
import {
  login,
  register,
  getUserProfile,
  logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import authHandler from "../middlewares/authHandler.js";
import { registerSchema, loginSchema } from "../utils/validationSchemas.js";

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", authHandler, getUserProfile);
router.post("/logout", authHandler, logout);
export default router;
