import { useState } from "react";
import { CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";
import SpendingPie from "./SpendingPie";
import MonthlyBar from "./MonthlyBar";

export default function Dashboard({ jwt }) {
  const [tx, setTx] = useState([]);

  const load = async () => {
    const res = await fetch("/api/plaid/transactions", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setTx(data.transactions || []);
  };

  if (!jwt)
    return <p className="text-center text-gray-500">Login to view dashboard.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={load}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          Load Recent Transactions
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium mb-3">Recent Transactions</h2>
        <ul className="divide-y divide-gray-200">
          {tx.length > 0 ? (
            tx.map((t) => (
              <li
                key={t.transaction_id}
                className="py-3 flex justify-between text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-blue-500" />
                  <span>{t.date} — {t.name}</span>
                </div>
                <span
                  className={`font-medium ${
                    t.amount < 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.amount < 0 ? (
                    <ArrowDownRight size={14} className="inline-block mr-1" />
                  ) : (
                    <ArrowUpRight size={14} className="inline-block mr-1" />
                  )}
                  {Math.abs(t.amount).toFixed(2)}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 py-2">No transactions loaded yet.</li>
          )}
        </ul>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Spending by Category (30 days)</h3>
          <SpendingPie jwt={jwt} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Income vs Expense (6 months)</h3>
          <MonthlyBar jwt={jwt} />
        </div>
      </div>
    </div>
  );
}
