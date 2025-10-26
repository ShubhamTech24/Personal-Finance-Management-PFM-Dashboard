import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Link2 } from "lucide-react";

export default function LinkBankButton({ jwt }) {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    if (!jwt) return;
    (async () => {
      const res = await fetch("/api/plaid/create_link_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setLinkToken(data.link_token);
    })();
  }, [jwt]);

  const onSuccess = async (public_token) => {
    await fetch("/api/plaid/set_access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ public_token }),
    });
    alert("✅ Bank linked! Go to Accounts or Dashboard.");
  };

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  if (!jwt) return null;

  return (
    <button
      disabled={!ready}
      onClick={() => open()}
      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
        ready
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-300 text-gray-600 cursor-not-allowed"
      }`}
    >
      <Link2 size={16} /> {ready ? "Link Bank" : "Preparing..."}
    </button>
  );
}
