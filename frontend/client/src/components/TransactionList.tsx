import { CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  transaction_id: string;
  date: string;
  name: string;
  amount: number;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <ul className="divide-y divide-border">
            {transactions.map((t) => (
              <li
                key={t.transaction_id}
                className="py-3 flex justify-between items-center"
                data-testid={`transaction-${t.transaction_id}`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-primary" />
                  <span className="text-foreground">
                    {t.date} — {t.name}
                  </span>
                </div>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    t.amount < 0 ? "text-chart-2" : "text-chart-4"
                  }`}
                >
                  {t.amount < 0 ? (
                    <ArrowDownRight size={14} />
                  ) : (
                    <ArrowUpRight size={14} />
                  )}
                  ${Math.abs(t.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No transactions loaded yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
