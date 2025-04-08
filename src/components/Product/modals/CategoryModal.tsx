'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Trash2, Pencil, Check, PlusCircle, XCircle } from 'lucide-react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../app/services/categoryService';
import { CategoryType } from '../../../app/types/product';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryModal({ isOpen, onClose }: Props) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [newRow, setNewRow] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    const data = await getCategories();
    const formatted = data.map((item: any) => ({
      id: item.categoryId,
      name: item.categoryName,
    }));
    setCategories(formatted);
  };

  const handleAddRow = () => {
    setNewRow('');
  };

  const handleSaveNew = async () => {
    if (!newRow?.trim()) return;
    try {
      await createCategory({ name: newRow });
      setNewRow(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  const handleEdit = (cat: CategoryType) => {
    setEditId(cat.id);
    setEditValue(cat.name);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) return;
    try {
      await updateCategory(editId!.toString(), { name: editValue });
      setEditId(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id.toString());
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValue('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-black">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold">
                Modify <span className="text-blue-600">Category</span>
              </h1>
              <p className="text-xs text-black">You can easily update the category here!</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 cursor-pointer" />
            </button>
          </div>

          <div className="flex justify-between items-center px-2 mb-2">
            <span className="text-sm font-semibold text-gray-600">Category List</span>
            <button onClick={handleAddRow} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 cursor-pointer">
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {newRow !== null && (
              <div className="flex justify-between items-center gap-2 px-2 py-1 bg-gray-50 rounded text-sm">
                <input
                  type="text"
                  placeholder="New Category"
                  className="border px-2 py-1 rounded w-full"
                  value={newRow}
                  onChange={(e) => setNewRow(e.target.value)}
                />
                <div className="flex gap-2 text-gray-500">
                  <button onClick={handleSaveNew}><Check className="w-4 h-4" /></button>
                  <button onClick={() => setNewRow(null)}><XCircle className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-2 py-1 border-b border-gray-200 text-sm gap-2">
                {editId === cat.id ? (
                  <>
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <div className="flex gap-2 text-gray-500">
                      <button onClick={handleSaveEdit}><Check className="w-4 h-4 cursor-pointer" /></button>
                      <button onClick={handleCancelEdit}><XCircle className="w-4 h-4 cursor-pointer" /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-gray-700">{cat.name}</p>
                    <div className="flex gap-2 text-gray-500">
                      <button onClick={() => handleEdit(cat)}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-500 bg-red-100 rounded px-3 py-2">
              {error}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
