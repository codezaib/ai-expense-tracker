import * as z from "zod";
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    ),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
  budget: z.number().positive("Budget must be a positive number"),
});
export const budgetSchema = z.object({
  amount: z.number().positive("Budget must be a positive number"),
  month: z
    .number()
    .int()
    .optional()
    .refine((v) => v === undefined || (v >= 1 && v <= 12), {
      message: "Month must be between 1 and 12",
    }),
  year: z
    .number()
    .int()
    .optional()
    .refine((v) => v === undefined || (v >= 2000 && v <= 2100), {
      message: "Year must be between 2000 and 2100",
    }),
});
const dateString = z
  .string()
  .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date" });

export const addExpenseSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be > 0")
    .nonoptional({ message: "Amount is required" }),
  category_id: z.number().int().positive().optional().nullable(),
  note: z.string().optional().nullable(),
  date: dateString.optional(),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be > 0").optional(),
  category_id: z.number().int().positive().optional().nullable(),
  note: z.string().optional().nullable(),
  date: dateString.optional(),
});

export const llmSchema = z.object({
  model: z.string().optional().nullable(),
  prompt: z.string().optional().nullable(),
  apiKey: z.string().optional().nullable(),
  message: z.string().min(1, "Message cannot be empty"),
});
