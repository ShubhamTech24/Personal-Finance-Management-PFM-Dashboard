import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function MonthlyBar({ jwt }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch("/api/summary/monthly-summary", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setRows(data.rows || []);
    })();
  }, [jwt]);

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
          <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
