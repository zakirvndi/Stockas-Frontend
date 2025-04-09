"use client";

import { useCallback, useEffect, useState } from "react";
import ProductTable from "@/components/Product/ProductTable";
import ProductCard from "@/components/Product/ProductCard";
import { ProductType, ProductAPIItem, ProductAPIResponse } from "../../types/product";
import { Filter, PlusCircle, Folder } from "lucide-react";
import { getProducts } from "@/app/services/productService";
import AddProductModal from "@/components/Product/modals/AddProductModal";
import EditProductModal from "@/components/Product/modals/EditProductModal";
import { DeleteProductModal } from "@/components/Product/modals/DeleteProductModal";
import UpdateStockModal from "@/components/Product/modals/UpdateStockModal";
import CategoryModal from "@/components/Product/modals/CategoryModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import FilterModal from "@/components/Product/modals/FilterModal";

export default function ProductPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [search, setSearch] = useState("");
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isUpdateStockOpen, setUpdateStockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    groupBy: "", 
    orderBy: "date", 
    orderDesc: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  

  
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());
  
      if (filter.groupBy) params.append("groupByCategory", "true");
      if (filter.orderBy) params.append("orderBy", filter.orderBy);
      if (filter.orderDesc) params.append("orderDesc", "true");
  
      const data: ProductAPIResponse = await getProducts("?" + params.toString());
  
      const formatted: ProductType[] = data.items.map((item: ProductAPIItem) => ({
        id: item.productId,
        name: item.productName,
        stock: item.quantity,
        sellingPrice: item.sellingPrice,
        buyingPrice: item.purchasePrice,
        inputDate: item.inputDate,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      }));
  
      setProducts(formatted);
  
      const total = Math.ceil(data.totalCount / pageSize);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [currentPage, pageSize, filter]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleUpdateStock = (product: ProductType) => {
    setSelectedProduct(product);
    setUpdateStockOpen(true);
  };

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  
  return (
    <ProtectedRoute>
      <div>
        <main className="p-6 space-y-4">
          <h1 className="text-xl font-semibold text-black">Product <span className="text-blue-600">List</span></h1>

          {/*Search  Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 text-gray-500 text-xs font-medium border-b-2 border-gray-200 pb-4">
            <input
              type="text"
              placeholder="Enter Category or Product Name"
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
        
          {/* table */}
          <div className="hidden lg:block">
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onUpdateStock={handleUpdateStock}
              onDelete={handleDelete}
            />
          </div>

          {/* Card*/}
          <div className="block lg:hidden">
            <ProductCard
              products={products}
              onEdit={handleEdit}
              onUpdateStock={handleUpdateStock}
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

        <AddProductModal
          isOpen={isAddOpen}
          onClose={() => setAddOpen(false)}
          onSuccess={() => {
            fetchProducts(); 
          }}
        />

        {isEditOpen && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            isOpen={isEditOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedProduct(null);
            }}
            onSuccess={fetchProducts}
          />
        )}

        {isDeleteOpen && selectedProduct && (
          <DeleteProductModal
            isOpen={isDeleteOpen}
            product={selectedProduct}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedProduct(null);
            }}
            onSuccess={fetchProducts}
          />
        )}

        {isUpdateStockOpen && selectedProduct && (
          <UpdateStockModal
            isOpen={isUpdateStockOpen}
            onClose={() => {
              setUpdateStockOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onSuccess={fetchProducts} 
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
