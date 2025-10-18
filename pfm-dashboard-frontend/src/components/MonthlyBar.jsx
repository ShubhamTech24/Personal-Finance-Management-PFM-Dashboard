import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlyBar({ jwt }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch('/api/summary/monthly-summary', { headers: { Authorization: `Bearer ${jwt}` } });
      const data = await res.json();
      setRows(data.rows || []);
    })();
  }, [jwt]);

  if (!jwt) return <p>Login first.</p>;
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={rows}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="expense" />
          <Bar dataKey="income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
