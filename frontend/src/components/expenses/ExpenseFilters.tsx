import { motion } from "motion/react";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";

interface FilterParams {
  dateRange: string;
  category_id: string;
  sort_by: string;
  order: string;
}

interface ExpenseFiltersProps {
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
}

export const ExpenseFilters = ({ filters, onChange }: ExpenseFiltersProps) => {
  const { data } = useGetCategoriesQuery(undefined);
  const categories = data?.categories ?? [];

  const set = (key: keyof FilterParams, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-surface border border-app rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            Date Range
          </label>
          <select
            className="w-full bg-app border border-app rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            value={filters.dateRange}
            onChange={(e) => set("dateRange", e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">This Month</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            Category
          </label>
          <select
            className="w-full bg-app border border-app rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            value={filters.category_id}
            onChange={(e) => set("category_id", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c: { id: number; name: string }) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            Sort By
          </label>
          <select
            className="w-full bg-app border border-app rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            value={`${filters.sort_by}_${filters.order}`}
            onChange={(e) => {
              const [sort_by, order] = e.target.value.split("_");
              onChange({ ...filters, sort_by, order });
            }}
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (High)</option>
            <option value="amount_asc">Amount (Low)</option>
            <option value="category_asc">Category (A-Z)</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};
