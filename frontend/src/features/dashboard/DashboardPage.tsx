import React from "react";
import {
  DollarSign,
  TrendingDown,
  Calendar,
  AlertCircle,
  Plus,
  LayoutGrid,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Button } from "../../components/common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import StatCard from "../../components/common/StatCard";
import { CategoryModal } from "../../components/expenses/CategoryModal";
import { ExpenseModal } from "../../components/expenses/ExpenseModal";
import SpendingTrendChart from "../../components/dashboard/SpendingTrendChart";
import BudgetOverview from "../../components/dashboard/BudgetOverview";
import RecentExpenses from "../../components/dashboard/RecentExpenses";
import {
  useGetBudgetsQuery,
  useGetCategoryBudgetsQuery,
} from "../../store/api/budgetApi";
import { useGetExpensesQuery } from "../../store/api/expenseApi";
import { useGetAlertsQuery } from "../../store/api/alertsApi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const [isCatModalOpen, setIsCatModalOpen] = React.useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);

  const { user } = useSelector((state: any) => state.auth);

  // Fetch everything ONCE here
  const { data: budgetData } = useGetBudgetsQuery();
  const { data: expenseData } = useGetExpensesQuery();
  const { data: categoryData } = useGetCategoryBudgetsQuery();
  const { data: alertData } = useGetAlertsQuery();

  const budgets = budgetData?.budgets ?? [];
  const singleBudget = budgets?.[0] ?? null;
  const categories = categoryData?.budgets ?? [];
  const expenses = expenseData?.expenses ?? [];
  const alerts = alertData?.alerts ?? [];
  const expensesSum = expenses?.reduce(
    (acc: number, exp: any) => acc + Number(exp.amount),
    0,
  );
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Hello, {user?.name || "User"}!
          </h1>
          <p className="text-muted-app font-medium">
            Your finances are looking healthy this month.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="cursor-pointer"
            icon={LayoutGrid}
            onClick={() => setIsCatModalOpen(true)}
          >
            Categories
          </Button>

          <Button
            icon={Plus}
            variant="secondary"
            className="border-2 border-app cursor-pointer border-dashed"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="h-full w-full">
            <CategoryModal
              isOpen={isCatModalOpen}
              onClose={() => setIsCatModalOpen(false)}
            />
          </div>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          heading="Spent This Month"
          text={
            !singleBudget && !expenses.length
              ? formatCurrency(0)
              : expenses.length > 0
                ? formatCurrency(expensesSum)
                : formatCurrency(0)
          }
          subtext="updated now"
          icon={DollarSign}
          glowColor="bg-primary"
        />

        {singleBudget?.remaining > 0 && (
          <StatCard
            heading="Remaining Budget"
            text={formatCurrency(singleBudget?.remaining ?? 0)}
            subtext={`${singleBudget?.percent_spent ?? 0}% used`}
            icon={TrendingDown}
            glowColor="bg-success"
          />
        )}

        <StatCard
          heading="Total Expenses"
          text={String(expenses.length)}
          subtext={`${categories.length} categories`}
          icon={Calendar}
          glowColor="bg-warning"
        />

        <StatCard
          heading="Active Alerts"
          text={String(alerts.length)}
          subtext="Critical Priority"
          icon={AlertCircle}
          glowColor="bg-danger"
        />
      </div>

      {/* Charts + Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SpendingTrendChart />
        <BudgetOverview budgets={categories} />
      </div>

      {/* Expenses */}
      <RecentExpenses expenses={expenses} />
    </div>
  );
};

export default DashboardPage;
