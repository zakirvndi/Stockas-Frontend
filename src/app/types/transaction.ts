export type TransactionType = {
    transactionId: number;
    transactionDate: string; 
    categoryName: string;
    type: string; 
    amount: number;
    description?: string;
};
  
export type TransactionCategoryType = {
    categoryId: number;
    categoryName: string;
    type: 'Income' | 'Expense'; 
};