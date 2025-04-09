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
  categoryId: number;
  categoryName: string;
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

  export type ProductInput = {
    productName: string;
    purchasePrice: number;
    sellingPrice: number;
    quantity: number;
    categoryId: number;
    inputDate: string;
  };

  export type ProductUpdate = {
    productId: number;
    productName: string;
    purchasePrice: number;
    sellingPrice: number;
    quantity: number;
    categoryId: number;
  };

  export type UpdateStock = {
    productId: number;
    productName: string;
    purchasePrice: number;
    sellingPrice: number;
    quantity: number;
    categoryId: number;
  };