import React, { useState, useEffect } from "react";
import { ProductType, ProductUpdate } from "@/app/types/product";
import { updateProduct } from "@/app/services/productService";
import { getCategories } from "@/app/services/categoryService";
import { CategoryType } from "@/app/types/product";
import { X } from "lucide-react";
import { Dialog } from "@headlessui/react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: ProductType | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [buyingPrice, setBuyingPrice] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryError, setCategoryError] = useState("");

    useEffect(() => {
        if (product && categories.length > 0) {
            setName(product.name);
            setCategoryId(product.categoryId);
            setStock(product.stock);
            setSellingPrice(product.sellingPrice);
            setBuyingPrice(product.buyingPrice);
        }
    }, [product, categories]);

  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const result: CategoryType[] = await getCategories();
          setCategories(result);
          if (result.length > 0) setCategoryId(result[0].categoryId);
        } catch (error) {
          console.error("Failed to fetch categories", error);
        }
      };

    if (isOpen) {
      fetchCategories();
    }
    }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

        const updatedProduct: ProductUpdate = {
          productId: product.id,
          productName: name,
          categoryId: categoryId!,
          quantity: stock,
          sellingPrice,
          purchasePrice: buyingPrice,
        };

        if (!categoryId || !categories.some(cat => cat.categoryId === categoryId)) {
            setCategoryError("Please reselect a valid category.");
            return;
        } else {
            setCategoryError("");
        }

        try {
        await updateProduct(product.id, updatedProduct);
        onSuccess();
        onClose();
        } catch (error) {
        console.error("Failed to update product", error);
        }
    };

  if (!isOpen || !product) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-black">
                Edit <span className="text-blue-600">Product</span>
              </h1>
              <p className="text-xs text-black">
                What kind of Product you like to edit?
              </p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-black text-xs">
            <div className="space-y-1">
              <label className="block">Product Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter new product name"
                className="w-full border border-gray-300 rounded px-3 py-2 "
              />
            </div>

            <div className="space-y-1">
                <label className="block">Category *</label>
                <select
                    value={categoryId ?? ""}
                    onChange={(e) => {
                    setCategoryId(Number(e.target.value));
                    setCategoryError(""); 
                    }}
                    required
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    categoryError
                        ? "border-red-300 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                    </option>
                    ))}
                </select>
                {categoryError && (
                    <p className="text-sm text-red-500 mt-1">{categoryError}</p>
                )}
            </div>


            <div className="space-y-1">
              <label className="block">Stock *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                placeholder="Enter new product stock"
                className="w-full border border-gray-300 rounded px-3 py-2 "
              />
            </div>
            
            <div className="space-y-1">
              <label className="block">Buying Price (IDR) *</label>
              <input
                type="number"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(Number(e.target.value))}
                required
                placeholder="Enter Buying Price"
                className="w-full border border-gray-300 rounded px-3 py-2 "
              />
            </div>

            <div className="space-y-1">
              <label className="block">Selling Price (IDR) *</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                required
                placeholder="Enter Selling Price"
                className="w-full border border-gray-300 rounded px-3 py-2 "
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

export default EditProductModal;
