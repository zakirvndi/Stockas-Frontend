"use client";

import { useEffect, useState } from "react";
import { X, PlusCircle, Trash2, Pencil, Check } from "lucide-react";
import { Dialog } from "@headlessui/react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../app/services/categoryService";
import { CategoryType } from "../../../app/types/product";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryModal({ isOpen, onClose }: Props) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const result = await createCategory({ name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingName.trim()) return;
    await updateCategory(id.toString(), { name: editingName });
    setEditingId(null);
    setEditingName("");
    fetchCategories();
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id.toString());
      await fetchCategories(); 
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-black">Modify <span className="text-blue-600">Category</span></h1>
            <p className="text-black text-xs">You can easily update category here</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </div>

          {/* Inline New Category */}
          <div className="flex gap-2 mb-4 text-black">
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2 overflow-y-auto max-h-60">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between border-b border-gray-100 px-3 py-2 rounded-md"
              >
                {editingId === cat.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateCategory(cat.id);
                    }}
                    className="flex-1 mr-2 border-1 rounded px-2 py-1 text-sm text-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-500">{cat.name}</span>
                )}
                <div className="flex gap-2">
                  {editingId === cat.id ? (
                    <button
                      onClick={() => handleUpdateCategory(cat.id)}
                      className="text-gray-500 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                      className="text-gray-500 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-gray-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
