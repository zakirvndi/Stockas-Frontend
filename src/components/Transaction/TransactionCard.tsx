import { TransactionType } from "../../app/types/transaction";
import { Pencil, Trash2 } from "lucide-react";

type TransactionCardProps = {
  transactions: TransactionType[];
  onEdit: (transaction: TransactionType) => void;
  onDelete: (transaction: TransactionType) => void;
};

export default function TransactionCard({
  transactions,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {transactions.map((tx) => (
        <div
          key={tx.transactionId}
          className="rounded-xl bg-white shadow-md text-black"
        >
          {/* Header: Category & Type */}
          <div className="flex justify-between bg-gray-50 p-4 items-center">
            <div className="flex flex-col justify-between py-2">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="font-semibold">IDR {tx.amount.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium
                    ${tx.type === "Income" ? "bg-green-100 text-green-600" : "bg-pink-100 text-pink-600"}`}
                >
                  <span
                    className={`w-1 h-1 rounded-full 
                      ${tx.type === "Income" ? "bg-green-500" : "bg-pink-500"}`}
                  />
                  {tx.type}
                </span>
            </div>
          </div>

          {/* Body: Detail Transaksi */}
          <div className="px-4 py-2 divide-y divide-gray-100 text-xs">
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Transaction ID</span>
              <span>{tx.transactionId}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Date</span>
              <span>{new Date(tx.transactionDate).toLocaleString("en-ID")}</span>
            </div>
            <div className="flex justify-between py-2">
              <p className="text-gray-500">Category</p>
              <p className="">{tx.categoryName}</p>
            </div>
            {tx.description && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Description</span>
                <span>{tx.description}</span>
              </div>
            )}
          </div>

          {/* Footer: Icon Actions */}
          <div className="flex gap-4 p-4 border-t border-gray-200 text-gray-500">
            <button onClick={() => onEdit(tx)}>
              <Pencil size={18} className="hover:scale-110 transition cursor-pointer" />
            </button>
            <button onClick={() => onDelete(tx)}>
              <Trash2 size={18} className="hover:scale-110 transition cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
