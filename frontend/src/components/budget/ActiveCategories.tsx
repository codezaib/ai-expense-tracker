import { Plus, LayoutGrid } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const getStatusColor = (percent: number) => {
  if (percent >= 90) return "#F43F5E";
  if (percent >= 70) return "#F59E0B";
  return "#10B981";
};

const ActiveCategories = ({ categories, onManage, onAddExpense }: any) => (
  <div className="bg-surface border border-app rounded-3xl p-8 space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-black">Active Categories</h3>
      <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-1 rounded-md">
        {categories.length} Total
      </span>
    </div>
    <div className="space-y-4">
      {categories.map((cat: any) => {
        const percent = Math.round(
          (Number(cat.spent) / Number(cat.limit)) * 100,
        );
        const statusColor = getStatusColor(percent);
        return (
          <div
            key={cat.category_id}
            className="group p-4 bg-app border border-app rounded-2xl hover:border-primary transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-app group-hover:bg-primary group-hover:text-white transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">{cat.category}</span>
              </div>
              <span
                className="text-xs font-black px-2 py-1 rounded-md"
                style={{
                  backgroundColor: `${statusColor}15`,
                  color: statusColor,
                }}
              >
                {percent}%
              </span>
            </div>
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-app">
              <span>
                {formatCurrency(cat.spent)}{" "}
                <span className="opacity-40">spent</span>
              </span>
              <span>
                {formatCurrency(cat.limit)}{" "}
                <span className="opacity-40">limit</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(percent, 100)}%`,
                  backgroundColor: statusColor,
                }}
              />
            </div>
          </div>
        );
      })}

      <button
        onClick={onAddExpense}
        className="w-full py-4 border-2 border-dashed border-app rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-muted-app hover:text-primary hover:border-primary transition-all font-bold text-sm"
      >
        <Plus className="w-4 h-4" /> Add Expense
      </button>

      <button
        onClick={onManage}
        className="w-full py-3 border border-app rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-muted-app hover:text-primary hover:border-primary transition-all font-bold text-sm"
      >
        <LayoutGrid className="w-4 h-4" /> Edit All Categories
      </button>
    </div>
  </div>
);

export default ActiveCategories;
