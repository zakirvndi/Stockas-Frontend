import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { ProductType } from '@/app/types/product'; 
import { createTransaction } from '@/app/services/transactionService';
import { createTransactionCategory, getTransactionCategories } from '@/app/services/transactionCategoryService';
import { updateStock } from '@/app/services/productService';
import toast from 'react-hot-toast';
import { X } from "lucide-react";
import { TransactionCategoryType } from '@/app/types/transaction';

type UpdateStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType;
  onSuccess: () => void;
};

const categoryMap = {
  sold: { name: 'Barang Terjual', type: 'Income' },
  restock: { name: 'Restock Barang', type: 'Expense' },
};

export default function UpdateStockModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: UpdateStockModalProps) {
  const [quantity, setQuantity] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (type: 'sold' | 'restock') => {
      if (!quantity || quantity <= 0) {
        toast.error('Quantity harus lebih dari 0');
        return;
      }
    
      const category = categoryMap[type];
      const amount = type === 'sold' ? quantity * product.sellingPrice : quantity * product.buyingPrice;
    
      const payload = {
        categoryName: category.name,
        productId: product.id,
        amount,
        description,
      };
    
      setIsSubmitting(true);
    
      try {
        
        const existingCategories = await getTransactionCategories();
        const found = existingCategories.find(
          (c: TransactionCategoryType) => c.categoryName === category.name
        );
    
        if (!found) {
          await createTransactionCategory({
            name: category.name,
            type: category.type,
          });
        }

        console.log("Payload to transaction", payload);
        await createTransaction(payload);
        
        const newStock =
          type === 'sold'
            ? product.stock - quantity
            : product.stock + quantity;

        await updateStock(product.id, {
          productId: product.id,
          productName: product.name,
          categoryId: product.categoryId,
          quantity: newStock,
          purchasePrice: product.buyingPrice,
          sellingPrice: product.sellingPrice,
        });
    
        toast.success('Stock berhasil diupdate!');
        onClose();
        onSuccess();
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Gagal update stock:', err);
          toast.error(err.message || 'Gagal update stock');
        } else {
          console.error('Unknown error:', err);
          toast.error('Gagal update stock');
        }
      }finally {
        setIsSubmitting(false);
      }
    };
  
    

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm text-black">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold mb-1 text-black">
                    Update <span className="text-blue-600">Stock</span> </h1>
                    <p className="text-xs text-black">Update your sales stock!</p>
                </div>
          
                <button onClick={onClose}>
                    <X className="w-5 h-5 text-gray-600 cursor-pointer" />
                </button>

            </div>
            

          <div className="mb-4">
            <label className="text-sm font-medium">Quantity *</label>
            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium">Description (optional)</label>
            <textarea
              placeholder="Write Description"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-center text-sm font">
            <button
              onClick={() => handleSubmit('sold')}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200"
              disabled={isSubmitting}
            >
              Sold
            </button>
            <button
              onClick={() => handleSubmit('restock')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
              disabled={isSubmitting}
            >
              Restock
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
