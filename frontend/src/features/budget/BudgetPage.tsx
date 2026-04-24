import React from "react";
import { AnimatePresence } from "motion/react";
import { Button } from "../../components/common/Button";
import { Target, LayoutGrid, Plus } from "lucide-react";
import { CategoryModal } from "../../components/expenses/CategoryModal";
import { BudgetLimitModal } from "../../components/budget/BudgetLimitModal";
import { ExpenseModal } from "../../components/expenses/ExpenseModal";
import BudgetStats from "../../components/budget/BudgetStats";
import SpendingHistory from "../../components/budget/SpendingHistory";
import ActiveCategories from "../../components/budget/ActiveCategories";
import {
  useGetCategoryBudgetsQuery,
  useGetBudgetsQuery,
} from "../../store/api/budgetApi";

const BudgetPage = () => {
  const [isCatModalOpen, setIsCatModalOpen] = React.useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = React.useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);

  const { data: categoryBudgets } = useGetCategoryBudgetsQuery();
  const { data: monthlyBudgets } = useGetBudgetsQuery();

  const budgets = monthlyBudgets?.budgets ?? [];
  const singleBudget = budgets?.[0] ?? null;
  const categories = categoryBudgets?.budgets ?? [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Budgeting</h1>
          <p className="text-muted-app font-medium">
            Control your spending and reach your financial goals.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={LayoutGrid}
            onClick={() => setIsCatModalOpen(true)}
          >
            Manage Categories
          </Button>
          <Button
            icon={Target}
            className="cursor-pointer"
            onClick={() => setIsLimitModalOpen(true)}
          >
            Set New Limit
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isCatModalOpen && (
          <div className="h-full w-full">
            <CategoryModal
              isOpen={isCatModalOpen}
              onClose={() => setIsCatModalOpen(false)}
            />
          </div>
        )}
        {isLimitModalOpen && (
          <BudgetLimitModal
            isOpen={isLimitModalOpen}
            onClose={() => setIsLimitModalOpen(false)}
          />
        )}
        {isExpenseModalOpen && (
          <div className="h-full w-full">
            <ExpenseModal
              isOpen={isExpenseModalOpen}
              onClose={() => setIsExpenseModalOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>

      <BudgetStats
        totalBudget={singleBudget?.limit ?? 0}
        totalSpent={singleBudget?.spent ?? 0}
        remaining={singleBudget?.remaining ?? 0}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <SpendingHistory
          data={budgets.map((b: any) => ({
            month: new Date(b.month).toLocaleString("default", {
              month: "short",
            }),
            spent: b.spent,
            budget: b.limit,
          }))}
        />
        <ActiveCategories
          categories={categories}
          onManage={() => setIsCatModalOpen(true)}
          onAddExpense={() => setIsExpenseModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default BudgetPage;
