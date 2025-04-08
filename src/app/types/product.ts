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