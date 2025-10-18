import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LinkBankButton from './components/LinkBankButton';
import Dashboard from './components/Dashboard';
import AccountsList from './components/AccountsList';
import BudgetPage from './components/BudgetPage';

export default function App() {
  const [jwt, setJwt] = useState('');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('secret123');

  const post = (url, body) => fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });

  const register = async () => {
    const res = await post('/api/auth/register', { email, password });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
  };
  const login = async () => {
    const res = await post('/api/auth/login', { email, password });
    const data = await res.json();
    if (data.token) setJwt(data.token);
    alert(data.message || (data.token ? 'Login OK' : 'Login failed'));
  };

  return (
    <div style={{ maxWidth: 900, margin: '1.5rem auto', padding: 16 }}>
      <nav style={{ display:'flex', gap:12, marginBottom:12 }}>
        <Link to="/">Home</Link>
        <Link to="/accounts">Accounts</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/budgets">Budgets</Link>
        {jwt && <button onClick={()=>setJwt('')}>Logout</button>}
      </nav>

      {!jwt ? (
        <div style={{ display:'grid', gap:8 }}>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
          </div>
          <small>After login, link a sandbox bank and open Dashboard.</small>
        </div>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <LinkBankButton jwt={jwt} /> <small>← Link sandbox bank first</small>
        </div>
      )}

      <Routes>
        <Route path="/" element={<div>Welcome to PFM MVP</div>} />
        <Route path="/accounts" element={<AccountsList jwt={jwt} />} />
        <Route path="/dashboard" element={<Dashboard jwt={jwt} />} />
        <Route path="/budgets" element={<BudgetPage jwt={jwt} />} />
      </Routes>
    </div>
  );
}
