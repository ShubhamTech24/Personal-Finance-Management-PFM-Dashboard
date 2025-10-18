import { useState } from 'react';
import SpendingPie from './SpendingPie';
import MonthlyBar from './MonthlyBar';

export default function Dashboard({ jwt }) {
  const [tx, setTx] = useState([]);
  const load = async () => {
    const res = await fetch('/api/plaid/transactions', { headers: { Authorization: `Bearer ${jwt}` } });
    const data = await res.json();
    setTx(data.transactions || []);
  };

  if (!jwt) return <p>Login first.</p>;

  return (
    <div style={{ display:'grid', gap:16 }}>
      <button onClick={load}>Load Recent Transactions</button>
      <ul style={{ margin:0, padding:0, listStyle:'none' }}>
        {tx.map(t => (
          <li key={t.transaction_id} style={{ padding:'6px 0', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between' }}>
            <span>{t.date} — {t.name}</span>
            <span>{t.amount}</span>
          </li>
        ))}
        {!tx.length && <li>No transactions loaded.</li>}
      </ul>

      <h3>Spending by Category (30d)</h3>
      <SpendingPie jwt={jwt} />

      <h3>Income vs Expense (6 months)</h3>
      <MonthlyBar jwt={jwt} />
    </div>
  );
}
