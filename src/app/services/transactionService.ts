const API = "https://stockas.azurewebsites.net"; 

export const getTransactions = async (page = 1, pageSize = 10) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transactions?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: token || "",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data; 
};

export const createTransaction = async (data: {
  categoryName: string;
  amount: number;
  description: string;
  productId?: number; 
}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token || "",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete transaction");
  }

  if (!response.ok) throw new Error("Failed to delete product");
  return;
};
