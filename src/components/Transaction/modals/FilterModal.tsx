import { Dialog } from "@headlessui/react";
import { useState } from "react";

type FilterProps = {
  isOpen: boolean;
  onClose: () => void;
  filter: {
    groupBy: string;
    sortBy: string;
    sortDesc: boolean;
  };
  setFilter: (value: {
    groupBy: string;
    sortBy: string;
    sortDesc: boolean;
  }) => void;
};

export default function TransactionFilterModal({
  isOpen,
  onClose,
  filter,
  setFilter,
}: FilterProps) {
  const [groupBy, setGroupBy] = useState(filter.groupBy);
  const [sortBy, setSortBy] = useState(filter.sortBy);
  const [sortDesc, setSortDesc] = useState(filter.sortDesc);

  const handleApply = () => {
    setFilter({ groupBy, sortBy, sortDesc });
    onClose();
  };

  const handleCancel = () => {
    setGroupBy(filter.groupBy);
    setSortBy(filter.sortBy);
    setSortDesc(filter.sortDesc);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center text-black">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-[320px] space-y-4">
          <Dialog.Title className="text-xl font-bold">
            Apply <span className="text-blue-600">Transaction Filter</span>
          </Dialog.Title>
          <p className="text-sm text-gray-500">
            Choose how you want to group or sort the transaction list.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">None</option>
              <option value="category">Category</option>
              <option value="type">Type</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Date</option>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={sortDesc}
              onChange={() => setSortDesc(!sortDesc)}
            />
            <label className="text-sm cursor-pointer">Descending</label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md bg-gray-200 text-sm hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
