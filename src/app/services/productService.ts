const API = "https://stockas.azurewebsites.net";

export const getProducts = async (params = "") => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/products${params}`, {
    headers: {
      Authorization: token || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return {
    items: data.items,
    totalCount: data.totalCount,
  };
};

export const createProduct = async (productData: any) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (id: number, updatedData: any) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify(updatedData),
  });
  return response.json();
};

export const deleteProduct = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token || "",
    },
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return;
};

export const updateStock = async (id: number, updatedProduct: any) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify(updatedProduct),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update stock");
  }

  return response.json();
};

