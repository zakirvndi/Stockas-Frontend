import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { getTransactionCategories } from "@/app/services/transactionCategoryService";
import { createTransaction } from "@/app/services/transactionService";
import { TransactionCategoryType } from "@/app/types/transaction";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<TransactionCategoryType[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");

    const fetchCategories = async () => {
        try {
            const result = await getTransactionCategories();
        
            setCategories(result); 
            if (result.length > 0) setCategoryName(result[0].categoryName);
        } catch (err) {
            console.error("Failed to fetch transaction categories:", err);
        }
    };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setAmount(0);
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!categoryName || amount <= 0) return;

    const transaction = {
      categoryName,
      amount,
      description,
      transactionDate: new Date().toISOString().split("T")[0],
    };

    try {
      await createTransaction(transaction);
      onClose();
      onSuccess();
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="bg-black/30 flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
          <Dialog.Title className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-black">
                Add <span className="text-blue-600">Transaction</span>
              </h1>
              <p className="text-black text-xs">What kind of transaction you liked add?</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </Dialog.Title>

          <div className="space-y-4 text-xs text-black">
            <div className="space-y-1">
              <label className="block">Category *</label>
              <select
                value={categoryName ?? ""}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              >
                {categories.map((cat) => (
                  <option key={cat.categoryName} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block">Amount (IDR) *</label>
              <input
                type="number"
                placeholder="Enter Transaction Amount"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block">Description (optional)</label>
              <input
                type="text"
                placeholder="Enter Transaction Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 text-xs">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Add New
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
