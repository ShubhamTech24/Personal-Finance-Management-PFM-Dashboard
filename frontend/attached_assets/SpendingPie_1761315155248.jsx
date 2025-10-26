import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

export default function SpendingPie({ jwt }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch("/api/summary/spend-by-category", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setRows((data.rows || []).filter((r) => r.value > 0));
    })();
  }, [jwt]);

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {rows.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
