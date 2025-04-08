import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { createProduct } from "@/app/services/productService";
import { getCategories } from "@/app/services/categoryService";
import { CategoryType } from "@/app/types/product";
import { X } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const fetchCategories = async () => {
    const result = await getCategories();
  
    const mapped = result.map((cat: any) => ({
      id: cat.categoryId,
      name: cat.categoryName,
    }));
  
    setCategories(mapped);
    if (mapped.length > 0) setCategoryId(mapped[0].id);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setName("");
      setBuyingPrice(0);
      setSellingPrice(0);
      setStock(0);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name || !categoryId) return;

    const productData = {
      productName: name,
      purchasePrice: buyingPrice,
      sellingPrice,
      quantity: stock,
      categoryId,
      inputDate: new Date().toISOString().split("T")[0], 
    };

    try {
      await createProduct(productData);
      onClose();
      onSuccess(); 
    } catch (error) {
      console.error("Failed to create product", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="bg-black/30 flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
          <Dialog.Title className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-black">Add <span className="text-blue-600">Product</span></h1>
              <p className="text-black text-xs">What kind of Product you liked add?</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </Dialog.Title>
         
          
          <div className="space-y-4 text-xs text-black">
            <div className="space-y-1">
              <label className="block">Product Name *</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block">Category *</label>
              <select
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block">Stock *</label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block">Buying Price (IDR) *</label>
              <input
                type="number"
                placeholder="Enter buying price"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(parseFloat(e.target.value))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block">Selling Price (IDR) *</label>
              <input
                type="number"
                placeholder="Enter selling price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-gray-500"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-4 text-xs">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">Add New</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
