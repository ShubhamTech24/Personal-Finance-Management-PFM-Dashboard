import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Budget {
  _id: string;
  category: string;
  monthlyLimit: number;
}

interface BudgetTableProps {
  budgets: Budget[];
  onDelete: (category: string) => void;
}

export default function BudgetTable({ budgets, onDelete }: BudgetTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Your Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead className="border-t border-border">
            <tr className="text-muted-foreground">
              <th className="py-3 font-medium">Category</th>
              <th className="py-3 font-medium text-right">Monthly Limit</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget._id} className="border-t border-border" data-testid={`budget-${budget.category}`}>
                <td className="py-3 text-foreground">{budget.category}</td>
                <td className="py-3 text-right font-medium">${budget.monthlyLimit}</td>
                <td className="py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(budget.category)}
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-delete-${budget.category}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
            {budgets.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-muted-foreground">
                  No budgets yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
