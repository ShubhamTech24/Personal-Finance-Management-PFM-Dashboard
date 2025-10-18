import { useEffect, useState } from 'react';

export default function AccountsList({ jwt }) {
  const [accounts, setAccounts] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch('/api/plaid/accounts', { headers: { Authorization: `Bearer ${jwt}` } });
      const data = await res.json();
      if (res.ok) setAccounts(data.accounts || []);
      else setErr(data.message || 'Failed');
    })();
  }, [jwt]);

  if (!jwt) return <p>Login first.</p>;
  if (err) return <p>Error: {err}</p>;
  if (!accounts.length) return <p>No accounts found yet.</p>;

  return (
    <div style={{ display:'grid', gap:8 }}>
      {accounts.map(a => (
        <div key={a.account_id} style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>
          <div><b>{a.name}</b> ({a.subtype})</div>
          <div>Current: {a.balances?.current} {a.balances?.iso_currency_code}</div>
          {a.balances?.available != null && <div>Available: {a.balances.available}</div>}
          <div>Mask: •••• {a.mask}</div>
        </div>
      ))}
    </div>
  );
}
