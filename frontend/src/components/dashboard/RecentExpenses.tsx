import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../common/Button";

const RecentExpenses = ({ expenses }: { expenses: any[] }) => {
  const navigate = useNavigate();

  if (!expenses)
    return <div className="animate-pulse bg-muted/10 rounded-3xl h-48" />;

  return (
    <div className="bg-surface border border-app rounded-3xl overflow-hidden">
      <div className="p-8 pb-4 flex items-center justify-between">
        <h3 className="text-xl font-black">Recent Expenses</h3>
        <Button
          variant="secondary"
          size="sm"
          className="cursor-pointer"
          onClick={() => navigate("/expenses")}
        >
          View All
        </Button>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-8">
          <span className="text-4xl mb-3">🧾</span>
          <p className="font-bold text-sm">No expenses logged yet</p>
          <p className="text-muted-app text-xs font-medium mt-1">Start tracking by adding your first expense.</p>
        </div>
      ) : (
        <div className="divide-y divide-app">
          {expenses.slice(0, 5).map((expense: any) => (
            <div
              key={expense.id}
              className="p-3 pr-8 flex items-center justify-between hover:bg-muted/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <p className="font-bold">{expense.categories?.name}</p>
                  <p className="text-[15px] text-muted-app font-medium uppercase">
                    {expense.note && `${expense.note} • `}
                    {expense.date.split("T")[0]}
                  </p>
                </div>
              </div>
              <p className={`font-black text-lg ${expense.amount < 0 ? "text-app" : "text-success"}`}>
                {expense.amount < 0 ? "-" : "+"}
                {formatCurrency(Math.abs(expense.amount))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;