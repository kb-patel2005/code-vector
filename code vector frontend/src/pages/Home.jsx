import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";
import { fetchProducts } from "../api";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [cursor, setCursor] = useState("");
    const [nextCursor, setNextCursor] = useState("");
    const [prevCursor, setPrevCursor] = useState("");
    const [page, setPage] = useState(0);

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
        setPage(1);
        loadProducts("next", "", true); // mark as initial load
    }, [category]);


    return (
        <div>
            <h1 style={{ textAlign: "center", color: "#5a2d82" }}>Products</h1>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Toys">Toys</option>
                </select>
            </div>
            {
                products.length > 0 && (<ProductTable products={products} />)
            }


            <div className="pagination-controls">
                <button disabled={!prevCursor || page <= 1} onClick={() => loadProducts("prev", prevCursor)}>Previous</button>
                <span>Page {page}</span>
                <button disabled={!nextCursor} onClick={() => loadProducts("next", nextCursor)}>Next</button>
            </div>
        </div>
    );
}