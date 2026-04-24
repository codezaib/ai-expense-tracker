import { formatCurrency } from "../../utils/formatCurrency";
import { Target } from "lucide-react";

const BudgetStats = ({ totalBudget, totalSpent, remaining }: any) => {
  const percent = Math.round((totalSpent / totalBudget) * 100) || 0;
  if (!totalBudget) {
    return (
      <div className="bg-surface border border-app rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 py-14">
        <span className="text-4xl">🎯</span>
        <p className="font-black text-lg">No budget limit set</p>
        <p className="text-muted-app text-sm font-medium">
          Set a monthly limit to start tracking your spending against a goal.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-surface border border-app rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-bold text-muted-app uppercase tracking-widest mb-1">
          Monthly Limit
        </p>
        <h4 className="text-2xl font-black">{formatCurrency(totalBudget)}</h4>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-app uppercase">
          <Target className="w-3 h-3" /> Updated now
        </div>
      </div>

      <div className="bg-surface border border-app rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-bold text-muted-app uppercase tracking-widest mb-1">
          Spent So Far
        </p>
        <h4 className="text-2xl font-black text-success">
          {formatCurrency(totalSpent)}
        </h4>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-success uppercase">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />{" "}
          Live Tracking
        </div>
      </div>

      <div className="bg-surface border border-app rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-bold text-muted-app uppercase tracking-widest mb-1">
          Remaining
        </p>
        <h4 className="text-2xl font-black">{formatCurrency(remaining)}</h4>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-app uppercase">
          Safe to spend: {formatCurrency(remaining / 10)} / day
        </div>
      </div>

      <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1 text-white">
          Usage Rate
        </p>
        <h4 className="text-2xl font-black text-white">{percent}%</h4>
        <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetStats;
