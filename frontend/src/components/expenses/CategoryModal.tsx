import { useState } from "react";
import { Trash2, Edit2, Plus, Check, X } from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} from "../../store/api/categoryApi";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  is_default: boolean;
  budgets?: { amount: number }[];
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryModal = ({ isOpen, onClose }: CategoryModalProps) => {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories: Category[] = data?.categories ?? [];

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [editCategory] = useEditCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingBudget, setEditingBudget] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;

    try {
      await createCategory({
        name: newName.trim(),
        budget: newBudget ? Number(newBudget) : undefined,
      }).unwrap();

      setNewName("");
      setNewBudget("");
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditingBudget(cat.budgets?.[0]?.amount?.toString() || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingBudget("");
  };

  const handleEdit = async () => {
    if (!editingId) return;

    try {
      await editCategory({
        id: editingId,
        name: editingName,
        budget: editingBudget ? Number(editingBudget) : undefined,
      }).unwrap();

      cancelEdit();
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <div className="flex gap-2 mb-5">
        <input
          placeholder="Category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 bg-app border border-app rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        <input
          placeholder="Budget"
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
          className="w-28 bg-app border border-app rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        <Button
          icon={Plus}
          variant="secondary"
          onClick={handleCreate}
          isLoading={isCreating}
          className="shrink-0 border-2 border-app cursor-pointer border-dashed"
        >
          Add
        </Button>
      </div>

      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">
              Loading categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-app rounded-2xl">
            <p className="text-sm text-muted-foreground">
              No categories found.
            </p>
          </div>
        ) : (
          categories.map((cat) => {
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`
            group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200
            ${
              isEditing
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
            }
          `}
              >
                <div className="flex-1 min-w-0 mr-4">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-background border border-input px-3 py-3 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-primary/20 outline-none w-full"
                        placeholder="Category Name"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                          $
                        </span>
                        <input
                          type="number"
                          value={editingBudget}
                          onChange={(e) => setEditingBudget(e.target.value)}
                          className="bg-background border border-input pl-6 pr-3 py-2 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary/20 w-32"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground truncate">
                          {cat.name}
                        </h3>
                        {cat.is_default && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary text-secondary-foreground uppercase tracking-tighter">
                            System
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary/40" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Budget:{" "}
                          <span className="text-foreground">
                            ${cat.budgets?.[0]?.amount || "0"}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <div className="flex gap-1">
                      <button
                        onClick={handleEdit}
                        className="p-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    !cat.is_default && (
                      <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
