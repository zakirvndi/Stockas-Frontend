import { TransactionType } from "../../app/types/transaction";
import { Pencil, Trash2 } from "lucide-react";

type TransactionTableProps = {
  transactions: TransactionType[];
  onEdit: (transaction: TransactionType) => void;
  onDelete: (transaction: TransactionType) => void;
};

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-black">
          <tr>
            <th className="p-3 text-center font-medium">ID</th>
            <th className="p-3 text-center font-medium">Transaction Date</th>
            <th className="p-3 text-center font-medium">Transaction Category</th>
            <th className="p-3 text-center font-medium">Type</th>
            <th className="p-3 text-center font-medium">Amount</th>
            <th className="p-3 text-center font-medium">Description</th>
            <th className="p-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transactionId} className="border-b border-gray-100 hover:bg-gray-50 text-gray-500 text-xs">
              <td className="p-3 text-center">{tx.transactionId}</td>
              <td className="p-3 text-center">
                {new Date(tx.transactionDate).toLocaleString("en-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </td>
              <td className="p-3 text-center">{tx.categoryName}</td>
              <td className="p-3 text-center">
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
              </td>
              <td className="p-3 text-center">IDR {tx.amount.toLocaleString()}</td>
              <td className="p-3 text-center">{tx.description || "-"}</td>
              <td className="p-3 flex gap-4 justify-center items-center text-gray-500">
                <button onClick={() => onEdit(tx)}>
                  <Pencil size={18} className="hover:scale-110 cursor-pointer" />
                </button>
                <button onClick={() => onDelete(tx)}>
                  <Trash2 size={18} className="hover:scale-110 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
