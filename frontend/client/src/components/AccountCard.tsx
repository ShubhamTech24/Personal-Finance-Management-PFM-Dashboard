import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Account {
  account_id: string;
  name: string;
  subtype: string;
  mask: string;
  balances?: {
    current: number;
    available?: number;
    iso_currency_code: string;
  };
}

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Card className="p-4 hover-elevate" data-testid={`account-${account.account_id}`}>
      <div className="flex items-center gap-3">
        <Wallet className="text-primary" size={20} />
        <div className="flex-1">
          <div className="font-medium text-foreground">
            {account.name}{" "}
            <span className="text-sm text-muted-foreground">({account.subtype})</span>
          </div>
          <div className="text-muted-foreground text-sm">Mask: •••• {account.mask}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-primary">
            {account.balances?.current} {account.balances?.iso_currency_code}
          </div>
          {account.balances?.available != null && (
            <div className="text-sm text-muted-foreground">
              Available: {account.balances.available}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
