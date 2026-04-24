import { Router } from "express";
import { getModels, sendMessage } from "../controllers/ai.controller.js";
import { validate } from "../middlewares/validate.js";
import { llmSchema } from "../utils/validationSchemas.js";
const route = Router();

route.get("/models", getModels);
route.post("/models/chat", validate(llmSchema), sendMessage);
export default route;
