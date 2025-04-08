const API = "https://stockas.azurewebsites.net"; 

export const getCategories = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/product-categories`, {
    headers: {
      Authorization: token || "",
    },
  });
  return response.json();
};

export const createCategory = async (data: { name: string }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/product-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify({ categoryName: data.name }),
  });
  return response.json();
};

export const updateCategory = async (id: string, data: { name: string }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/product-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify({ categoryName: data.name }), 
  });
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/product-categories/${id}`, {
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
