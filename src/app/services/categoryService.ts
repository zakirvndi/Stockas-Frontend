import { getToken } from "@/utils/auth";

const API = "https://stockas.azurewebsites.net"; 

export const getCategories = async () => {
  const token = getToken();

  try {
    const response = await fetch(`${API}/api/product-categories`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
};

export const createCategory = async (data: { name: string }) => {
  const token = getToken();
  const response = await fetch(`${API}/api/product-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ categoryName: data.name }),
  });
  return response.json();
};

export const updateCategory = async (id: string, data: { name: string }) => {
  const token = getToken();
  const response = await fetch(`${API}/api/product-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ categoryName: data.name }), 
  });
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const token = getToken();
  const response = await fetch(`${API}/api/product-categories/${id}`, {
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
