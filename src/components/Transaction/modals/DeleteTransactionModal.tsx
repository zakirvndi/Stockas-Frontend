import { Dialog } from "@headlessui/react";
import { TransactionType } from "@/app/types/transaction";
import { deleteTransaction } from "@/app/services/transactionService";

type DeleteTransactionModalProps = {
  isOpen: boolean;
  transaction: TransactionType;
  onClose: () => void;
  onSuccess: () => void;
};

export const DeleteTransactionModal = ({
  isOpen,
  transaction,
  onClose,
  onSuccess,
}: DeleteTransactionModalProps) => {
  const handleDelete = async () => {
    if (!transaction) return;

    try {
      await deleteTransaction(transaction.transactionId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-black">
            Delete <span className="text-blue-600">Transaction</span>
          </h2>
          <p className="text-xs text-gray-600 mt-2">
            Are you sure want to delete this transaction{" "}
            <span className="font-semibold">{ transaction.categoryName }</span> ?
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
