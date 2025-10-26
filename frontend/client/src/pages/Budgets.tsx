import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BudgetForm from "@/components/BudgetForm";
import BudgetTable from "@/components/BudgetTable";
import { Loader2 } from "lucide-react";

export default function Budgets() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/budgets'],
    queryFn: api.budgets.list,
  });

  const createMutation = useMutation({
    mutationFn: ({ category, monthlyLimit }: { category: string; monthlyLimit: number }) =>
      api.budgets.create(category, monthlyLimit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      toast({
        title: "Budget saved",
        description: "Your budget has been created/updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save budget",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (category: string) => api.budgets.delete(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      toast({
        title: "Budget deleted",
        description: "Your budget has been removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete budget",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = (category: string, monthlyLimit: number) => {
    createMutation.mutate({ category, monthlyLimit });
  };

  const handleDelete = (category: string) => {
    deleteMutation.mutate(category);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Budget Management</h1>
      
      <BudgetForm onSave={handleSave} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <BudgetTable budgets={data?.rows || []} onDelete={handleDelete} />
      )}
    </div>
  );
}
