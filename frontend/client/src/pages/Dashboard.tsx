import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import TransactionList from "@/components/TransactionList";
import SpendingChart from "@/components/SpendingChart";
import MonthlyChart from "@/components/MonthlyChart";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: transactionsData, isLoading: loadingTransactions } = useQuery({
    queryKey: ['/api/plaid/transactions'],
    queryFn: api.plaid.getTransactions,
    retry: false,
  });

  const { data: spendingData, isLoading: loadingSpending } = useQuery({
    queryKey: ['/api/summary/spend-by-category'],
    queryFn: api.summary.spendByCategory,
    retry: false,
  });

  const { data: monthlyData, isLoading: loadingMonthly } = useQuery({
    queryKey: ['/api/summary/monthly-summary'],
    queryFn: api.summary.monthlySummary,
    retry: false,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/plaid/transactions'] });
    queryClient.invalidateQueries({ queryKey: ['/api/summary/spend-by-category'] });
    queryClient.invalidateQueries({ queryKey: ['/api/summary/monthly-summary'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
        <Button onClick={handleRefresh} data-testid="button-load-transactions">
          Refresh Data
        </Button>
      </div>

      {loadingTransactions ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TransactionList transactions={transactionsData?.transactions || []} />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {loadingSpending ? (
          <div className="flex items-center justify-center py-20 border border-border rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <SpendingChart data={spendingData?.rows || []} />
        )}

        {loadingMonthly ? (
          <div className="flex items-center justify-center py-20 border border-border rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <MonthlyChart data={monthlyData?.rows || []} />
        )}
      </div>
    </div>
  );
}
