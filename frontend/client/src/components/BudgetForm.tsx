import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface BudgetFormProps {
  onSave: (category: string, limit: number) => void;
}

export default function BudgetForm({ onSave }: BudgetFormProps) {
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("5000");

  const handleSave = () => {
    onSave(category, Number(limit));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-2 min-w-[180px]">
            <Label htmlFor="category" className="text-sm text-muted-foreground">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-testid="input-category"
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <Label htmlFor="limit" className="text-sm text-muted-foreground">
              Monthly Limit ($)
            </Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              data-testid="input-limit"
            />
          </div>
          <Button onClick={handleSave} className="gap-2" data-testid="button-save-budget">
            <Plus size={16} />
            Save Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
