import { Router } from "express";
import {
  getAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  deleteAlert,
} from "../controllers/alert.controller.js";

const router = Router();
router.get("/", getAlerts);
router.post("/read/:id", markAlertAsRead);
router.post("/read", markAllAlertsAsRead);
router.delete("/:id", deleteAlert);

export default router;
