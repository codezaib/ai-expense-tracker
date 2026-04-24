import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useDeleteExpenseMutation } from '../../store/api/expenseApi';
import toast from 'react-hot-toast';

interface Expense {
  id: number;
  date: string;
  amount: number;
  note?: string;
  categories?: { name: string; icon?: string };
}

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

export const ExpenseTable = ({ expenses, onEdit }: ExpenseTableProps) => {
  const [deleteExpense] = useDeleteExpenseMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id).unwrap();
      toast.success('Expense deleted');
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/5 border-b border-app">
            {[
              { label: 'Date', sortable: true, align: 'left' },
              { label: 'Category', sortable: false, align: 'left' },
              { label: 'Note', sortable: false, align: 'left' },
              { label: 'Amount', sortable: true, align: 'right' },
              { label: 'Actions', sortable: false, align: 'center' },
            ].map(({ label, sortable, align }) => (
              <th key={label} className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-app text-${align}`}>
                {sortable ? (
                  <div className={`flex items-center gap-2 cursor-pointer hover:text-app ${align === 'right' ? 'justify-end' : ''}`}>
                    {label} <ArrowUpDown className="w-3 h-3" />
                  </div>
                ) : label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-app">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-muted/5 transition-colors group">
              <td className="px-6 py-5">
                <span className="font-bold text-sm">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs">{expense.categories?.icon ?? '💰'}</span>
                  </div>
                  <span className="font-bold text-sm">{expense.categories?.name ?? '—'}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-sm text-muted-app font-medium">{expense.note ?? '—'}</td>
              <td className="px-6 py-5 text-right font-black text-sm whitespace-nowrap">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                  <button
                    title="Edit"
                    onClick={() => onEdit(expense)}
                    className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 hover:bg-danger/10 hover:text-danger rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};