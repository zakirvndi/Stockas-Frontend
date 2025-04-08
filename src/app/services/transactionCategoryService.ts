const API = "https://stockas.azurewebsites.net";

export const getTransactionCategories = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transaction-categories`, {
    headers: {
      Authorization: token || "",
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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transaction-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify({
      categoryName: data.name,
      type: data.type,
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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transaction-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify({
      categoryName: data.name,
      type: data.type,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update transaction category");
  }

  return response.json();
};

export const deleteTransactionCategory = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/transaction-categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token || "",
    },
  });

  if (response.status === 204) return null; 
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.title || "Failed to delete category");
  }

  return await response.json(); 
};
