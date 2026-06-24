import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";
import { fetchProducts } from "../api";
import { useNavigate } from "react-router-dom";
import "../App.css";
import socket from "../socket";   // shared socket instance

export default function Home() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [cursor, setCursor] = useState("");
    const [nextCursor, setNextCursor] = useState("");
    const [prevCursor, setPrevCursor] = useState("");
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    async function loadProducts(direction = "next", cursorValue = "", isInitial = false) {
        const data = await fetchProducts({ limit: 20, category, direction, cursor: cursorValue });
        setProducts(data.products);
        setNextCursor(data.nextCursor || "");
        setPrevCursor(data.prevCursor || "");
        if (!isInitial) {
            direction === "next"
                ? setPage(p => p + 1)
                : setPage(p => Math.max(1, p - 1));
        }
    }

    useEffect(() => {
        socket.emit("joinChannel", "krishchannel");

        socket.on("productUpdated", (updatedProduct) => {
            setProducts((prev) =>
                prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
        });

        socket.on("productDeleted", ({ id }) => {
            console.log(id, products)
            setProducts((prev) => prev.filter((p) => p.id != id));
        });

        return () => {
            socket.off("productUpdated");
            socket.off("productDeleted");
        };
    }, []);

    useEffect(() => {
        setPage(1);
        loadProducts("next", "", true);
    }, [category]);

    return (
        <div className="p-6">
            <h1 className="text-center text-2xl font-bold text-purple-400 mb-6">
                Products
            </h1>

            <div className="flex justify-center items-center gap-4 mb-6">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                    <option value="">All</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Toys">Toys</option>
                </select>

                <button
                    onClick={() => navigate("/add")}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
                >
                    Add Products
                </button>
            </div>

            {products.length > 0 && <ProductTable products={products} />}

            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    disabled={!prevCursor || page <= 1}
                    onClick={() => loadProducts("prev", prevCursor)}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
                >
                    Previous
                </button>

                <span className="font-medium">Page {page}</span>

                <button
                    disabled={!nextCursor}
                    onClick={() => loadProducts("next", nextCursor)}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
