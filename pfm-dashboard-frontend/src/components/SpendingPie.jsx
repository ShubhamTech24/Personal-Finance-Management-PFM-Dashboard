import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SpendingPie({ jwt }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch('/api/summary/spend-by-category', { headers: { Authorization: `Bearer ${jwt}` } });
      const data = await res.json();
      setRows((data.rows || []).filter(r => r.value > 0));
    })();
  }, [jwt]);

  if (!jwt) return <p>Login first.</p>;
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
