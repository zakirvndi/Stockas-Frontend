import { ProductType } from "../../app/types/product";
import { Pencil, Trash2, Box } from "lucide-react";

type ProductTableProps = {
  products: ProductType[];
  onEdit: (product: ProductType) => void;
  onUpdateStock: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onUpdateStock,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-black">
          <tr>
            <th className="p-3 text-center font-medium">ID</th>
            <th className="p-3 text-center font-medium">Input Date</th>
            <th className="p-3 text-center font-medium">Product Name</th>
            <th className="p-3 text-center font-medium">Product Category</th>
            <th className="p-3 text-center font-medium">Stock</th>
            <th className="p-3 text-center font-medium">Buying Price</th>
            <th className="p-3 text-center font-medium">Selling Price</th>
            <th className="p-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 font-normal text-gray-500 text-xs">
              <td className="p-3 text-center">{product.id}</td>
              <td className="p-3 text-center">
                  {new Date(product.inputDate).toLocaleString('en-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, 
                  })}
              </td>
              <td className="p-3 text-center">{product.name}</td>
              <td className="p-3 text-center">{product.categoryName}</td>
              <td className="p-3 text-center">{product.stock}</td>
              <td className="p-3 text-center">IDR {product.buyingPrice.toLocaleString()}</td>
              <td className="p-3 text-center">IDR {product.sellingPrice.toLocaleString()}</td>
              <td className="p-3 flex gap-4 justify-center items-center text-gray-500">
                <button onClick={() => onEdit(product)}>
                  <Pencil size={18} className="hover:scale-110 cursor-pointer" />
                </button>
                <button onClick={() => onDelete(product)}>
                  <Trash2 size={18} className="hover:scale-110 cursor-pointer" />
                </button>
                <button onClick={() => onUpdateStock(product)}>
                  <Box size={18} className="hover:scale-110 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
