import { getToken } from "@/utils/auth";

const API = "https://stockas.azurewebsites.net"; 

export const getTransactions = async (
  queryOrPage: string | number = 1,
  pageSize = 10
) => {
  const token = getToken();
  let url = `${API}/api/transactions`;

  if (typeof queryOrPage === "string") {
    url += queryOrPage;
  } else {
    url += `?page=${queryOrPage}&pageSize=${pageSize}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return {
    items: Array.isArray(data) ? data : (data.items || []),
    totalCount: data.totalCount ?? (Array.isArray(data) ? data.length : 0),
  };
};

export const createTransaction = async (data: {
  categoryName: string;
  amount: number;
  description: string;
  productId?: number; 
}) => {
  const token = getToken();
  const response = await fetch(`${API}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }

  return await response.json();
};

export const updateTransaction = async (id: number, data: any) => {
  const token = getToken();
  const response = await fetch(`${API}/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update transaction");
  }

  return response.json();
};

export const deleteTransaction = async (id: number) => {
  const token = getToken();
  const response = await fetch(`${API}/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete transaction");
  }

  if (!response.ok) throw new Error("Failed to delete product");
  return;
};
