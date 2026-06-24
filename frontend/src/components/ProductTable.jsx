import { useNavigate } from "react-router-dom";
import '../App.css'

export default function ProductTable({ products }) {
  const navigate = useNavigate();

  const handleUpdate = (product) => {
    navigate("/add", { state: product });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Product deleted!");
    }
  };

  return (
    <table className="w-11/12 mx-auto border-collapse rounded-lg shadow-md overflow-hidden">
      <thead>
        <tr className="bg-purple-700 text-white">
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Category</th>
          <th className="px-4 py-2 text-left">Price</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, idx) => (
          <tr
            key={p.id}
            className={`${idx % 2 === 0 ? "bg-white" : "bg-purple-50"
              } hover:bg-purple-100`}
          >
            <td className="px-4 py-2">{p.id}</td>
            <td className="px-4 py-2">{p.name}</td>
            <td className="px-4 py-2">{p.category}</td>
            <td className="px-4 py-2">{p.price}</td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => handleUpdate(p)}
                className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}
