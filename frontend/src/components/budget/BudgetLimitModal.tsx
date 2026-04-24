import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Target } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateBudgetMutation } from "../../store/api/budgetApi";

export const BudgetLimitModal = ({ isOpen, onClose }: any) => {
  const { register, handleSubmit, reset } = useForm();
  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();

  const onSubmit = async (data) => {
    try {
      await updateBudget({
        id: data.id,
        amount: Number(data.globalLimit),
      }).unwrap();
      toast.success("Budget limit updated!");
      reset();
      onClose();
    } catch {
      toast.error("Failed to update budget limit");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Budget Controls">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Strategic Planning</p>
            <p className="text-xs text-muted-app font-medium leading-relaxed">
              Setting a monthly limit helps you stay disciplined. Smart alerts
              will notify you at 80% usage.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            Global Monthly Limit
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-muted-app">
              $
            </span>
            <input
              type="number"
              placeholder="5,000"
              {...register("globalLimit", { required: true })}
              className="w-full bg-app border border-app rounded-2xl pl-10 pr-4 py-4 text-2xl font-black focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="primary"
            className="flex-1"
            onClick={onClose}
            type="button"
          >
            Discard
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="flex-1"
            isLoading={isLoading}
          >
            Update Limit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
