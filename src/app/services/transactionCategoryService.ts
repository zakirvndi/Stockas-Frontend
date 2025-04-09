import { getToken } from "@/utils/auth";

const API = "https://stockas.azurewebsites.net";

export const getTransactionCategories = async () => {
  const token = getToken();
  const response = await fetch(`${API}/api/transaction-categories`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch transaction categories");
  }

  return await response.json();
};

export const createTransactionCategory = async (data: {
  name: string;
  type: string;
}) => {
  const token = getToken();

  if (!data.type || !data.name) {
    throw new Error('Both Type and CategoryName are required');
  }

  const response = await fetch(`${API}/api/transaction-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      Type: data.type,
      CategoryName: data.name,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create transaction category");
  }

  return await response.json();
};

export const updateTransactionCategory = async (
  id: number, 
  data: { 
    name: string,
    type: 'Income' | 'Expense'
}) => {
  const token = getToken();
  const response = await fetch(`${API}/api/transaction-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      Type: data.type,
      CategoryName: data.name,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update transaction category");
  }

  return response.json();
};

export const deleteTransactionCategory = async (id: number) => {
  const token = getToken();
  const response = await fetch(`${API}/api/transaction-categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (response.status === 204) return null; 
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.title || "Failed to delete category");
  }

  return await response.json(); 
};
