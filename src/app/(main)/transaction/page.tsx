"use client";

import { useCallback, useEffect, useState } from "react";
import TransactionCard from "@/components/Transaction/TransactionCard";
import TransactionTable from "@/components/Transaction/TransactionTable";
import { TransactionType } from "@/app/types/transaction";
import { getTransactions } from "@/app/services/transactionService";
import { Filter, PlusCircle, Folder } from "lucide-react";
import AddTransactionModal from "@/components/Transaction/modals/AddTransactionModal";
import EditTransactionModal from "@/components/Transaction/modals/EditTransactionModal";
import { DeleteTransactionModal } from "@/components/Transaction/modals/DeleteTransactionModal";
import CategoryModal from "@/components/Transaction/modals/CategoryModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import FilterModal from "@/components/Transaction/modals/FilterModal";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    groupBy: "",
    sortBy: "",
    sortDesc: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  
  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());
  
      if (filter.groupBy) params.append("groupBy", filter.groupBy);
      if (filter.sortBy) params.append("sortBy", filter.sortBy);
      if (filter.sortDesc) params.append("sortDesc", "true");
  
      const { items, totalCount } = await getTransactions("?" + params.toString());
  
      setTransactions(items);
      const total = Math.ceil(totalCount / pageSize);
      setTotalPages(total);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEdit = (tx: TransactionType) => {
    setSelectedTransaction(tx);
    setEditOpen(true);
  };

  const handleDelete = (tx: TransactionType) => {
    setSelectedTransaction(tx);
    setDeleteOpen(true);
  };

  return (
    <ProtectedRoute>
      <div>
        <main className="p-6 space-y-4">
          <h1 className="text-xl font-semibold text-black">
            Transaction <span className="text-blue-600">List</span>
          </h1>

        {/*Search  Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 text-gray-500 text-xs font-medium border-b-2 border-gray-200 pb-4">
            <input
              type="text"
              placeholder="Enter Category Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden lg:block " >Filter</span>
              </button>
              <button
                onClick={() => setCategoryOpen(true)}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-md px-4 py-2 hover:bg-blue-200 cursor-pointer"
              >
                <Folder className="w-4 h-4" />
                <span className="hidden lg:block">Category</span>
              </button>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden lg:block">Add New</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="hidden lg:block">
            <TransactionTable
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Card View for Mobile */}
          <div className="block lg:hidden">
            <TransactionCard
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>

        {/* Pagination */}
        <div className="flex justify-end mt-auto p-4 gap-2 border-t border-gray-200 text-gray-500 text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 text-black bg-white border border-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span className="px-2 py-1 text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 text-black bg-white border border-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>

        {isCategoryOpen && (
          <CategoryModal
            isOpen={isCategoryOpen}
            onClose={() => setCategoryOpen(false)}
          />
        )}

        
        {isAddOpen && (
          <AddTransactionModal
            isOpen={isAddOpen}
            onClose={() => setAddOpen(false)}
            onSuccess={fetchTransactions}
          />
        )}

        {isEditOpen && selectedTransaction && (
          <EditTransactionModal
            isOpen={isEditOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedTransaction(null);
            }}
            transaction={selectedTransaction}
            onSuccess={fetchTransactions}
          />
        )}

        {isDeleteOpen && selectedTransaction && (
          <DeleteTransactionModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedTransaction(null);
            }}
            transaction={selectedTransaction}
            onSuccess={fetchTransactions}
          />
        )} 

        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setFilterOpen(false)}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
    </ProtectedRoute>
  );
}
