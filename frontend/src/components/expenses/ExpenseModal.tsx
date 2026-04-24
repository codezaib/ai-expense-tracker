import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAddExpenseMutation,
  useUpdateExpenseMutation,
} from "../../store/api/expenseApi";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";

export const ExpenseModal = ({ isOpen, onClose, expense }: any) => {
  const isEditing = !!expense?.id;

  const { data, isLoading: isCatLoading } = useGetCategoriesQuery();
  const categories = data?.categories ?? [];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        category_id: expense.categories?.id ?? "",
        date: expense.date?.split("T")[0],
        note: expense.note ?? "",
      });
    } else {
      reset({ date: new Date().toISOString().split("T")[0] });
    }
  }, [expense, reset]);

  const [addExpense, { isLoading: isAdding }] = useAddExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const isLoading = isAdding || isUpdating;

  const onSubmit = async (data: any) => {
    const payload = {
      amount: parseFloat(data.amount),
      category_id: data.category_id ? Number(data.category_id) : null,
      date: data.date,
      note: data.note || null,
    };

    try {
      if (isEditing) {
        await updateExpense({ id: expense.id, ...payload }).unwrap();
        toast.success("Expense updated successfully!");
      } else {
        await addExpense(payload).unwrap();
        toast.success("Expense logged successfully!");
      }
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        isEditing ? "Failed to update expense" : "Failed to log expense",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Expense" : "Log Expense"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            Amount
          </label>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-app">
              <DollarSign className="w-5 h-5" />
            </div>

            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", { required: true })}
              className="w-full bg-app border border-app rounded-2xl pl-12 pr-4 py-4 text-lg font-black focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
              Category
            </label>

            <select
              {...register("category_id")}
              className="w-full bg-app border border-app rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-bold"
            >
              <option value="">No Category</option>

              {isCatLoading ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.category}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
              Date
            </label>

            <input
              type="date"
              {...register("date")}
              className="w-full bg-app border border-app rounded-xl px-4 py-3 text-sm [color-scheme:dark] focus:border-primary outline-none font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            Note (Optional)
          </label>

          <textarea
            placeholder="Add some details..."
            {...register("note")}
            className="w-full bg-app border border-app rounded-xl px-4 py-3 text-sm focus:border-primary outline-none min-h-[100px] font-medium"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="priamry"
            className="flex-1"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="secondary"
            className="flex-1 shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Log Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
