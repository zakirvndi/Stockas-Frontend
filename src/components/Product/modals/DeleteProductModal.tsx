import { Dialog } from "@headlessui/react";
import { ProductType } from "@/app/types/product";
import { deleteProduct } from "@/app/services/productService";

type DeleteProductModalProps = {
  isOpen: boolean;
  product: ProductType;
  onClose: () => void;
  onSuccess: () => void;
};

export const DeleteProductModal = ({
  isOpen,
  product,
  onClose,
  onSuccess,
}: DeleteProductModalProps) => {
    const handleDelete = async () => {
        if (!product) return;
    
        try {
        await deleteProduct(product.id);
        onSuccess(); 
        onClose();  
        } catch (error) {
        console.error("Failed to delete product", error);
        }
    };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-black">
            Delete <span className="text-blue-600">Product</span>
          </h2>
          <p className="text-xs text-gray-600 mt-2">
            Are you sure want to delete{" "}
            <span className="font-semibold">{product.name}</span> ?
          </p>

          <div className="flex justify-center gap-4 mt-6 text-xs font-medium">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
