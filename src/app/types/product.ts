export type ProductType = {
  id: number;
  name: string;
  categoryId: number; 
  categoryName: string;
  stock: number;
  sellingPrice: number;
  buyingPrice: number;
  inputDate: string;
};
  
export type CategoryType = {
    id: number;
    name: string;
  };

  export type ProductAPIItem = {
    productId: number;
    productName: string;
    quantity: number;
    sellingPrice: number;
    purchasePrice: number;
    inputDate: string;
    categoryId: number;
    categoryName: string;
  };
  
  export type ProductAPIResponse = {
    items: ProductAPIItem[];
    totalCount: number;
  };