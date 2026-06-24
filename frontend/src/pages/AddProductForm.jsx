import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../App.css'
import { API_URL } from "../api";

export default function AddProductForm() {
    const location = useLocation();
    const product = location.state;
    const isUpdate = !!product;

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: ""
    });

    useEffect(() => {
        if (isUpdate) {
            setForm({
                name: product.name,
                category: product.category,
                price: product.price
            });
        }
    }, [isUpdate, product]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdate) {
            await fetch(`${API_URL}/api/products/${product.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            alert("Product updated!");
        } else {
            await fetch(`${API_URL}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            alert("Product added!");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
        >
            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
                {isUpdate ? "Update Product" : "Add Product"}
            </h2>

            <input
                name="name"
                value={form.name}
                placeholder="Name"
                onChange={handleChange}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <input
                name="category"
                value={form.category}
                placeholder="Category"
                onChange={handleChange}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <input
                name="price"
                type="number"
                value={form.price}
                placeholder="Price"
                onChange={handleChange}
                className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <button
                type="submit"
                className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
            >
                {isUpdate ? "Update" : "Add"}
            </button>
        </form>

    );
}
