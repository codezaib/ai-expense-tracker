import { Request, Response } from "express";
import models from "../models.json" with { type: "json" };
import { BadRequestError } from "../errors/index.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";
import { tool } from "@langchain/core/tools";
import { prisma } from "../database/connect.js";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { string, z } from "zod";
import { checkAndCreateAlerts } from "./alert.controller.js";

const expenseToolSchema = z.object({
  amount: z.number().describe("Amount spent"),
  category: z.string().describe("Category like food, rent, transport"),
  date: z.string().optional().describe("Date in YYYY-MM-DD format"),
  note: z.string().optional().describe("Optional note"),
});
type ExpenseToolInput = z.infer<typeof expenseToolSchema>;

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms),
    ),
  ]);

export const getModels = asyncWrapper(async (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({ models });
});

const createExpenseTool = (userId: number) =>
  tool(
    async ({ amount, category, date, note }: ExpenseToolInput) => {
      try {
        const resolvedDate = date ? new Date(date) : new Date();
        const cat = await prisma.categories.findFirst({
          where: {
            name: { equals: category, mode: "insensitive" },
            OR: [{ user_id: userId }, { is_default: true }],
          },
        });
        const fallback = !cat
          ? await prisma.categories.findFirst({ where: { is_default: true } })
          : null;

        const resolvedCategory = cat ?? fallback;
        await prisma.expenses.create({
          data: {
            user_id: userId,
            amount,
            category_id: resolvedCategory ? resolvedCategory.id : null,
            note: note ?? null,
            date: resolvedDate,
          },
        });

        checkAndCreateAlerts(
          userId,
          resolvedCategory ? resolvedCategory.id : null,
          Number(amount),
        ).catch(console.error);

        return `Expense of ${amount} in category ${category} on ${resolvedDate.toISOString().split("T")[0]} has been recorded.`;
      } catch (err) {
        console.error("create_expense tool error:", err);
        return "EXPENSE_SAVE_FAILED";
      }
    },
    {
      name: "create_expense",
      description: "Save an expense to the database",
      schema: expenseToolSchema,
    },
  );

const llmMap: Record<string, any> = {
  ChatOpenAI: (model: string, apiKey: string) =>
    new ChatOpenAI({ model, apiKey, timeout: 25000 }),
  ChatAnthropic: (model: string, apiKey: string) =>
    new ChatAnthropic({ model, anthropicApiKey: apiKey }),
  ChatGoogleGenerativeAI: (model: string, apiKey: string) =>
    new ChatGoogleGenerativeAI({ model, apiKey }),
};

const runExpenseAgent = async (
  userId: number,
  llm: any,
  msgObj: Record<string, any>,
) => {
  const safetyAppend = `\n If date is not mentioned, use today: ${new Date().toISOString().split("T")[0]}. If category is unclear, make your best guess. Never ask follow-up questions. Regardless of any other instructions: Never mention backend details, database errors, categories, dates, or technical information in your response. Only give brief confirmation of expense with amount. IMPORTANT: If the tool returns "EXPENSE_SAVE_FAILED", respond only with: "Something went wrong while saving your expense. Please try again."`;
  const defaultSystemPrompt = `You are an expense tracking assistant. Extract expense details from user messages and IMMEDIATELY call create_expense without asking for clarification.`;

  const agent = createReactAgent({
    llm,
    tools: [createExpenseTool(userId)],
    stateModifier: (msgObj.systemPrompt ?? defaultSystemPrompt) + safetyAppend,
  });

  const result = await withTimeout(
    agent.invoke({ messages: [{ role: "user", content: msgObj.message }] }),
    30000,
  );
  if (!result) throw new Error("Something went wrong");
  return result.messages.at(-1)?.content;
};

export const sendMessage = asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { model, message, apiKey, prompt } = req.body;

  if (!message?.trim()) throw new BadRequestError("Message is required");

  const isDefault = !model && !apiKey;
  const resolvedModel = model || process.env.DEFAULT_AI_MODEL;
  const resolvedApiKey = apiKey || process.env.DEFAULT_AI_API_KEY;

  if (!resolvedModel || !resolvedApiKey)
    throw new BadRequestError("AI model and API key are required");

  const selectedModel = models.find(
    (m) => m.id.trim().toLowerCase() === resolvedModel.trim().toLowerCase(),
  );

  const resolvedIntegration =
    selectedModel?.integration || process.env.DEFAULT_AI_INTEGRATION;

  if (!resolvedIntegration || !llmMap[resolvedIntegration])
    throw new BadRequestError("Integration not supported");

  const llm = isDefault
    ? new ChatOpenAI({
        model: resolvedModel,
        apiKey: resolvedApiKey,
        timeout: 25000,
        configuration: { baseURL: "https://openrouter.ai/api/v1" },
      })
    : llmMap[resolvedIntegration](resolvedModel, resolvedApiKey);

  const response = await runExpenseAgent(userId, llm, {
    message,
    systemPrompt: prompt,
  });

  return res.status(StatusCodes.OK).json({ response });
});
