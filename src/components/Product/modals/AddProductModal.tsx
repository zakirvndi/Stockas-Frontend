import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { createProduct } from "@/app/services/productService";
import { getCategories } from "@/app/services/categoryService";
import { CategoryType } from "@/app/types/product";
import { X } from "lucide-react";
import toast from "react-hot-toast";

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

  const [errors, setErrors] = useState({
    name: "",
    categoryId: "",
    stock: "",
    buyingPrice: "",
    sellingPrice: ""
  });

  const fetchCategories = async () => {
    try {
      const result: CategoryType[] = await getCategories();
      setCategories(result);
      if (result.length > 0) setCategoryId(result[0].categoryId);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setName("");
      setBuyingPrice(0);
      setSellingPrice(0);
      setStock(0);
      setErrors({
        name: "",
        categoryId: "",
        stock: "",
        buyingPrice: "",
        sellingPrice: ""
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const newErrors = {
      name: name.trim() === "" ? "Product Name must be filled." : "",
      categoryId: categoryId === null ? "category must choosed." : "",
      stock: stock <= 0 ? "Stock must be greater than 0." : "",
      buyingPrice: buyingPrice <= 0 ? "Buying Price must be greater than 0." : "",
      sellingPrice: sellingPrice <= 0 ? "Selling Price must be greater than 0." : ""
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((val) => val !== "");
    if (hasErrors) {
      toast.error("Mohon lengkapi form dengan benar.");
      return;
    }

    const productData = {
      productName: name,
      purchasePrice: buyingPrice,
      sellingPrice,
      quantity: stock,
      categoryId : categoryId!,
      inputDate: new Date().toISOString().split("T")[0]
    };

    try {
      await createProduct(productData);
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to create product", error);
      toast.error("Failed to create product.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="bg-black/30 flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
          <Dialog.Title className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-black">
                Add <span className="text-blue-600">Product</span>
              </h1>
              <p className="text-black text-xs">What kind of Product you liked add?</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </Dialog.Title>

          <div className="space-y-4 text-xs text-black">
            {/* Product Name */}
            <div className="space-y-1">
              <label className="block">Product Name *</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded px-3 py-2 text-gray-500 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block">Category *</label>
              <select
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className={`w-full border rounded px-3 py-2 text-gray-500 ${
                  errors.categoryId ? "border-red-500" : "border-gray-200"
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500">{errors.categoryId}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label className="block">Stock *</label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                className={`w-full border rounded px-3 py-2 text-gray-500 ${
                  errors.stock ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.stock && <p className="text-red-500">{errors.stock}</p>}
            </div>

            {/* Buying Price */}
            <div className="space-y-1">
              <label className="block">Buying Price (IDR) *</label>
              <input
                type="number"
                placeholder="Enter buying price"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(parseFloat(e.target.value))}
                className={`w-full border rounded px-3 py-2 text-gray-500 ${
                  errors.buyingPrice ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.buyingPrice && <p className="text-red-500">{errors.buyingPrice}</p>}
            </div>

            {/* Selling Price */}
            <div className="space-y-1">
              <label className="block">Selling Price (IDR) *</label>
              <input
                type="number"
                placeholder="Enter selling price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                className={`w-full border rounded px-3 py-2 text-gray-500 ${
                  errors.sellingPrice ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.sellingPrice && <p className="text-red-500">{errors.sellingPrice}</p>}
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
