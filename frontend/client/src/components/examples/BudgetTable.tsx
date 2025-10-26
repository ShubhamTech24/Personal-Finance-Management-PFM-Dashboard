import BudgetTable from '../BudgetTable';

// todo: remove mock functionality
const mockBudgets = [
  { _id: '1', category: 'Food', monthlyLimit: 500 },
  { _id: '2', category: 'Transport', monthlyLimit: 200 },
  { _id: '3', category: 'Entertainment', monthlyLimit: 150 },
];

export default function BudgetTableExample() {
  return (
    <BudgetTable
      budgets={mockBudgets}
      onDelete={(category) => console.log('Delete budget:', category)}
    />
  );
}
