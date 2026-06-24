const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://code-vector-z6tm.onrender.com"
    : "http://localhost:5000/";

export async function fetchProducts(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/products?${query}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}