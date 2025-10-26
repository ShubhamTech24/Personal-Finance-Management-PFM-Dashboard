import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LinkBankButton from "./components/LinkBankButton";
import Dashboard from "./components/Dashboard";
import AccountsList from "./components/AccountsList";
import BudgetPage from "./components/BudgetPage";
import Layout from "./components/Layout";

export default function App() {
  const [jwt, setJwt] = useState("");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("secret123");

  const post = (url, body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const register = async () => {
    const res = await post("/api/auth/register", { email, password });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
  };

  const login = async () => {
    const res = await post("/api/auth/login", { email, password });
    const data = await res.json();
    if (data.token) setJwt(data.token);
    alert(data.message || (data.token ? "Login OK" : "Login failed"));
  };

  return (
    <Layout jwt={jwt} onLogout={() => setJwt("")}>
      {!jwt ? (
        <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Welcome to PFM Dashboard
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Sign in or create an account to start managing your finances.
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />

          <div className="flex justify-between">
            <button
              onClick={register}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Register
            </button>
            <button
              onClick={login}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </div>
          <small className="block text-center text-gray-500">
            After login, link a sandbox bank and open the Dashboard.
          </small>
        </div>
      ) : (
        <div className="flex justify-center mb-6">
          <LinkBankButton jwt={jwt} />
        </div>
      )}

      <div className="px-4 md:px-8">
        <Routes>
          <Route path="/" element={<div className="text-center text-lg text-gray-700">Welcome to your Personal Finance Manager Dashboard</div>} />
          <Route path="/accounts" element={<AccountsList jwt={jwt} />} />
          <Route path="/dashboard" element={<Dashboard jwt={jwt} />} />
          <Route path="/budgets" element={<BudgetPage jwt={jwt} />} />
        </Routes>
      </div>
    </Layout>
  );
}
