import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import AccountCard from "@/components/AccountCard";
import { Loader2 } from "lucide-react";

export default function Accounts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/plaid/accounts'],
    queryFn: api.plaid.getAccounts,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Linked Accounts</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No accounts found. Click "Link Bank" to connect your bank account.
          </p>
        </div>
      ) : data?.accounts?.length > 0 ? (
        <div className="grid gap-4">
          {data.accounts.map((account: any) => (
            <AccountCard key={account.account_id} account={account} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No accounts found. Link a bank to get started.
        </p>
      )}
    </div>
  );
}
