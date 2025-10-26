import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export default function AccountsList({ jwt }) {
  const [accounts, setAccounts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch("/api/plaid/accounts", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (res.ok) setAccounts(data.accounts || []);
      else setErr(data.message || "Failed");
    })();
  }, [jwt]);

  if (!jwt) return <p className="text-center text-gray-500">Login first.</p>;
  if (err) return <p className="text-center text-red-600">Error: {err}</p>;
  if (!accounts.length)
    return <p className="text-center text-gray-500">No accounts found yet.</p>;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Linked Accounts</h2>
      {accounts.map((a) => (
        <div
          key={a.account_id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <Wallet className="text-blue-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {a.name} <span className="text-sm text-gray-500">({a.subtype})</span>
              </div>
              <div className="text-gray-600 text-sm">Mask: •••• {a.mask}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-700">
                {a.balances?.current} {a.balances?.iso_currency_code}
              </div>
              {a.balances?.available != null && (
                <div className="text-sm text-gray-500">
                  Available: {a.balances.available}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
