import { useState, useMemo } from "react";
import { Plus, Search, Filter, Download, LayoutGrid } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Button } from "../../components/common/Button";
import { ExpenseFilters } from "../../components/expenses/ExpenseFilters";
import { ExpenseTable } from "../../components/expenses/ExpenseTable";
import { ExpensePagination } from "../../components/expenses/ExpensePagination";
import { CategoryModal } from "../../components/expenses/CategoryModal";
import { ExpenseModal } from "../../components/expenses/ExpenseModal";
import { useGetExpensesQuery } from "../../store/api/expenseApi";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// For PDF Export
const handleExport = (expenses) => {
  const doc = new jsPDF();
  doc.text("Expense Report", 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [["Date", "Category", "Note", "Amount"]],
    body: expenses.map((e: any) => [
      new Date(e.date).toLocaleDateString(),
      e.categories?.name ?? "—",
      e.note ?? "—",
      `$${e.amount}`,
    ]),
  });
  doc.save("expenses.pdf");
};
const DEFAULT_FILTERS = {
  dateRange: "30",
  category_id: "",
  sort_by: "date",
  order: "desc",
};
const PER_PAGE = 10;

const ExpensesPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchQuery(q);
      setPage(1);
    }
  }, [searchParams]);
  const queryParams = useMemo(() => {
    const p: Record<string, any> = {
      sort_by: filters.sort_by,
      order: filters.order,
      ...(filters.category_id && { category_id: filters.category_id }),
      ...(searchQuery && { search: searchQuery }),
    };
    if (filters.dateRange) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - Number(filters.dateRange));
      p.start = start.toISOString().split("T")[0];
      p.end = end.toISOString().split("T")[0];
    }
    return p;
  }, [filters, searchQuery]);

  const { data, isLoading, isError } = useGetExpensesQuery(queryParams);
  const expenses = data?.expenses ?? [];

  const paginated = expenses.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Expense Logs
          </h1>
          <p className="text-muted-app font-medium">
            Manage and track your detailed spending history.
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
            icon={Plus}
            variant="secondary"
            className="border-2 border-app cursor-pointer border-dashed"
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isCatModalOpen && (
          <CategoryModal
            isOpen={isCatModalOpen}
            onClose={() => setIsCatModalOpen(false)}
          />
        )}
        {isExpenseModalOpen && (
          <ExpenseModal
            isOpen={isExpenseModalOpen}
            expense={editingExpense}
            onClose={() => {
              setIsExpenseModalOpen(false);
              setEditingExpense(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="bg-surface border border-app rounded-3xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-app" />
          <input
            type="text"
            placeholder="Search notes, categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-app border border-app rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={
              isFilterOpen ? "bg-primary/10 border-primary text-primary" : ""
            }
          >
            Filters
          </Button>
          <Button
            variant="secondary"
            className="cursor-pointer"
            icon={Download}
            onClick={() => handleExport(expenses)}
          >
            Export
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <ExpenseFilters
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
        )}
      </AnimatePresence>

      <div className="bg-surface border border-app rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-muted-app font-medium">
            Loading expenses...
          </div>
        ) : isError ? (
          <div className="p-20 text-center text-danger font-medium">
            Failed to load expenses.
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-20 text-center text-muted-app font-medium">
            No expenses found.
          </div>
        ) : (
          <ExpenseTable expenses={paginated} onEdit={handleEdit} />
        )}
        <ExpensePagination
          page={page}
          total={expenses.length}
          perPage={PER_PAGE}
          onChange={setPage}
        />
      </div>
    </div>
  );
};

export default ExpensesPage;
