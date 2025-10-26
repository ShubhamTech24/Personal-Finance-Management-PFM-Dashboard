import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

export default function BudgetPage({ jwt }) {
  const [rows, setRows] = useState([]);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState(5000);

  const load = async () => {
    const res = await fetch("/api/budgets", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setRows(data.rows || []);
  };

  const save = async () => {
    await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ category, monthlyLimit: Number(limit) }),
    });
    await load();
  };

  const del = async (c) => {
    await fetch(`/api/budgets/${encodeURIComponent(c)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    await load();
  };

  useEffect(() => {
    if (jwt) load();
  }, [jwt]);

  if (!jwt) return <p className="text-center text-gray-500">Login first.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Budget Management</h1>

      <div className="flex flex-wrap gap-3 items-end bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Monthly Limit ($)</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={16} /> Save
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-medium mb-3">Your Budgets</h2>
        <table className="w-full text-left border-t border-gray-200">
          <thead className="text-gray-600">
            <tr>
              <th className="py-2">Category</th>
              <th className="py-2 text-right">Monthly Limit</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="py-2">{r.category}</td>
                <td className="py-2 text-right">${r.monthlyLimit}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => del(r.category)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="3" className="text-center py-3 text-gray-500">
                  No budgets yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
