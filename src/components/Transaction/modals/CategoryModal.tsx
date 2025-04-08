'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  X,
  Trash2,
  Pencil,
  Check,
  PlusCircle,
  XCircle,
} from 'lucide-react';
import {
  getTransactionCategories,
  createTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
} from '@/app/services/transactionCategoryService';
import { TransactionCategoryType } from '@/app/types/transaction';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionCategoryModal({ isOpen, onClose }: Props) {
  const [categories, setCategories] = useState<TransactionCategoryType[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<{ name: string; type: 'Income' | 'Expense' } | null>(null);
  const [editData, setEditData] = useState<{ name: string; type: 'Income' | 'Expense' }>({ name: '', type: 'Expense' });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    const data = await getTransactionCategories();
    const formatted: TransactionCategoryType[] = data.map((item: any) => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      type: item.type,
    }));
    setCategories(formatted);
  };

  const handleAddRow = () => {
    setNewRow({ name: '', type: 'Expense' });
  };

  const handleSaveNewRow = async () => {
    if (!newRow?.name.trim()) return;
    try {
      await createTransactionCategory(newRow);
      setNewRow(null);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransactionCategory(id);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete category');
    }
  };

  const handleEdit = (cat: TransactionCategoryType) => {
    setEditId(cat.categoryId);
    setEditData({ name: cat.categoryName, type: cat.type });
  };

  const handleSaveEdit = async () => {
    if (!editData.name.trim()) return;
    try {
      await updateTransactionCategory(editId!, { name: editData.name, type: editData.type });
      setEditId(null);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({ name: '', type: 'Expense' });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-black">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold text-black">
                Modify <span className="text-blue-600">Category</span>
              </h1>
              <p className="text-xs text-black">You can easily update the category here!</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 cursor-pointer" />
            </button>
          </div>

          <div className="flex items-center justify-between font-semibold text-sm text-gray-600 px-2 mt-3">
            <span>Category List</span>
            <span>Type</span>
            <button onClick={handleAddRow} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 cursor-pointer">
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto mt-2">
            {newRow && (
              <div className="flex items-center justify-between gap-2 px-2 py-1 bg-gray-50 rounded text-xs md:text-sm">
                <div className="flex gap-2 items-center justify-between">
                  <input
                    type="text"
                    placeholder="New Category"
                    className="border px-2 py-1 rounded w-1/2 md:w-full"
                    value={newRow.name}
                    onChange={(e) =>
                      setNewRow({ ...newRow, name: e.target.value })
                    }
                  />
                  <select
                    className="border px-2 py-1 rounded"
                    value={newRow.type}
                    onChange={(e) =>
                      setNewRow({ ...newRow, type: e.target.value as 'Income' | 'Expense' })
                    }
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                <div className="flex gap-2 text-gray-500">
                  <button onClick={handleSaveNewRow}>
                    <Check className="w-4 h-4 cursor-pointer" />
                  </button>
                  <button onClick={() => setNewRow(null)}>
                    <XCircle className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
              </div>
            )}

            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                className="flex items-center justify-between px-2 py-1 border-b border-gray-200 text-xs md:text-sm gap-2"
              >
                {editId === cat.categoryId ? (
                  <>
                    <div className="flex gap-2 items-center justify-between text-xs md:text-sm">
                      <input
                        className="border px-2 py-1 rounded w-1/2 md:w-full"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                      <select
                        className="border px-2 py-1 rounded"
                        value={editData.type}
                        onChange={(e) => setEditData({ ...editData, type: e.target.value as 'Income' | 'Expense' })}
                      >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                    </div>
                    <div className="flex gap-2 text-gray-500">
                      <button onClick={handleSaveEdit}>
                        <Check className="w-4 h-4  cursor-pointer" />
                      </button>
                      <button onClick={handleCancelEdit}>
                        <XCircle className="w-4 h-4  cursor-pointer" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-gray-700">{cat.categoryName}</p>
                    <p className="flex-2 text-center text-gray-500 capitalize">{cat.type}</p>
                    <div className="flex gap-2 text-gray-500">
                      <button onClick={() => handleEdit(cat)}>
                        <Pencil className="w-4 h-4 cursor-pointer"/>
                      </button>
                      <button onClick={() => handleDelete(cat.categoryId)}>
                        <Trash2 className="w-4 h-4 cursor-pointer"/>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="mt-4 text-sm text-red-500 bg-red-100 rounded px-3 py-2">
              {errorMessage}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
