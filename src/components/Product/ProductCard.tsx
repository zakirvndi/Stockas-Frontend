import { ProductType } from "../../app/types/product";
import { Pencil, Trash2, Box } from "lucide-react";

type ProductCardProps = {
  products: ProductType[];
  onEdit: (product: ProductType) => void;
  onUpdateStock: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
};

export default function ProductCard({
  products,
  onEdit,
  onUpdateStock,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl bg-white shadow-md text-black"
        >
          {/* Header: Harga */}
          <div className="flex justify-between bg-gray-50 p-4">
            <div className="text-left">
              <p className="text-sm text-gray-500">Buying Price</p>
              <p className="font-semibold">IDR {product.buyingPrice.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Selling Price</p>
              <p className="font-semibold">IDR {product.sellingPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Body: Detail Produk */}
          <div className="px-4 py-2 divide-y divide-gray-100 text-xs">
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Product ID</span>
              <span>{product.id}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Input Date</span>
              <span>{product.inputDate}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Product Name</span>
              <span>{product.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Category</span>
              <span>{product.categoryName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Stock</span>
              <span>{product.stock}</span>
            </div>
          </div>

          {/* Footer: Icon Actions */}
          <div className="flex gap-4 p-4 border-t border-gray-200 text-gray-500">
            <button onClick={() => onEdit(product)}>
              <Pencil size={18} className=" hover:scale-110 transition cursor-pointer" />
            </button>
            <button onClick={() => onDelete(product)}>
              <Trash2 size={18} className=" hover:scale-110 transition cursor-pointer" />
            </button>
            <button onClick={() => onUpdateStock(product)}>
              <Box size={18} className=" hover:scale-110 transition cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
