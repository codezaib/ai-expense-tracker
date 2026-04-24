import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./database/connect.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import budgetRoutes from "./routes/budget.route.js";
import expenseRoutes from "./routes/expense.route.js";
import alertRoutes from "./routes/alert.route.js";
import aiRoutes from "./routes/ai.route.js";
import authHandler from "./middlewares/authHandler.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(hpp());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(mongoSanitize({}));
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});
app.use(
  "/api/v1",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: "Too many requests, try again later.",
  }),
);
app.use(
  "/api/v1/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
  }),
);

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", authHandler, categoryRoutes);
app.use("/api/v1/budgets", authHandler, budgetRoutes);
app.use("/api/v1/expenses", authHandler, expenseRoutes);
app.use("/api/v1/alerts", authHandler, alertRoutes);
app.use("/api/v1/ai", authHandler, aiRoutes);

//middlewares
app.use(errorHandler);
app.use(notFoundHandler);

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

export default app;
