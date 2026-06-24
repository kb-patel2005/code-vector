import React from "react";

export default function ProductTable({ products }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Created</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td><strong>{p.name}</strong></td>
            <td>{p.category}</td>
            <td>${p.price}</td>
            <td>{new Date(p.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
