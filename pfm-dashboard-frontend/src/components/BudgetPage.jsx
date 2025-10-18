import { useEffect, useState } from 'react';

export default function BudgetPage({ jwt }) {
  const [rows, setRows] = useState([]);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState(5000);

  const load = async () => {
    const res = await fetch('/api/budgets', { headers: { Authorization: `Bearer ${jwt}` } });
    const data = await res.json();
    setRows(data.rows || []);
  };

  const save = async () => {
    await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ category, monthlyLimit: Number(limit) })
    });
    await load();
  };

  const del = async (c) => {
    await fetch(`/api/budgets/${encodeURIComponent(c)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${jwt}` } });
    await load();
  };

  useEffect(() => { if(jwt) load(); }, [jwt]);
  if (!jwt) return <p>Login first.</p>;

  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ display:'flex', gap:8 }}>
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category"/>
        <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} placeholder="Monthly Limit"/>
        <button onClick={save}>Save</button>
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead><tr><th align="left">Category</th><th align="right">Monthly Limit</th><th></th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r._id}>
              <td>{r.category}</td>
              <td align="right">{r.monthlyLimit}</td>
              <td><button onClick={()=>del(r.category)}>Delete</button></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="3">No budgets yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
