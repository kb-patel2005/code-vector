import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../App.css'
import { API_URL } from "../api";

export default function AddProductForm() {
    const location = useLocation();
    const product = location.state;
    const isUpdate = !!product;
    const navigate = useNavigate();

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
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        alert(res.error)
                    } else {
                        alert("product updated successfully");
                        navigate("/");
                    }
                });
        } else {
            await fetch(`${API_URL}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        alert(res.error)
                    } else {
                        alert("product updated successfully");
                        navigate("/");
                    }
                });
        }

    };

    return (
        <div className="h-[100vh]  flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="max-w-md mt-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div
                    className="w-1/5 text-indigo-700 rounded-md hover:text-purple-700 cursor-pointer transition"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </div>
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

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                    <option value="">All</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Toys">Toys</option>
                </select>
                {/* <input
                    name="category"

                    placeholder="Category"
                    onChange={handleChange}
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                /> */}

                <input
                    name="price"
                    type="number"
                    value={form.price}
                    placeholder="Price"
                    onChange={handleChange}
                    className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <div>

                    <button
                        type="submit"
                        className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
                    >
                        {isUpdate ? "Update" : "Add"}
                    </button>
                </div>

            </form>
        </div>
    );
}
