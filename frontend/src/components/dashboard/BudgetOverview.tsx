import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../common/Button";

const COLOR_MAP: Record<string, string> = {
  primary: "bg-primary",
  warning: "bg-warning",
  danger: "bg-danger",
  success: "bg-success",
};

const BudgetOverview = ({ budgets }: { budgets: any[] }) => {
  const navigate = useNavigate();

  if (!budgets)
    return <div className="animate-pulse bg-muted/10 rounded-3xl h-64" />;

  return (
    <div className="bg-surface border border-app rounded-3xl p-8">
      <h3 className="text-xl font-black mb-6">Budgets</h3>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-4xl mb-3">📊</span>
          <p className="font-bold text-sm">No budgets set up yet</p>
          <p className="text-muted-app text-xs font-medium mt-1">Create a budget to start tracking your spending limits.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {budgets.map((item: any) => {
            const percent = item.limit
              ? Math.min((item.spent / item.limit) * 100, 100)
              : 0;

            return (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{item.category}</span>
                  <span className="text-muted-app">
                    {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${COLOR_MAP[item.color] ?? "bg-primary"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="secondary"
        className="w-full mt-8 border border-app cursor-pointer border-dashed hover:border-solid"
        onClick={() => navigate("/budget")}
      >
        Manage Budgets
      </Button>
    </div>
  );
};

export default BudgetOverview;