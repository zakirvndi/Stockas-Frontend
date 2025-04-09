import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { updateTransaction } from "@/app/services/transactionService";
import { getTransactionCategories } from "@/app/services/transactionCategoryService";
import { TransactionCategoryType, TransactionType } from "@/app/types/transaction";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: TransactionType | null;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  transaction,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (transaction) {
      setCategoryName(transaction.categoryName);
      setAmount(transaction.amount);
      setDescription(transaction.description ?? "");
    }
  }, [transaction]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getTransactionCategories();
      const formatted = data.map((item: TransactionCategoryType) => item.categoryName);
      setCategories(formatted);
    };
  
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    const updatedData = {
      categoryName,
      amount,
      description,
    };

    try {
      await updateTransaction(transaction.transactionId, updatedData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-black">
                Edit <span className="text-blue-600">Transaction</span>
              </h1>
              <p className="text-xs text-black">Modify this transaction detail</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-black text-xs">
            <div>
              <label className="block">Category *</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Amount *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter transaction amount"
              />
            </div>

            <div>
              <label className="block">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Optional description"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditTransactionModal;
