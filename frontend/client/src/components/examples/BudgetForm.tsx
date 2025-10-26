import BudgetForm from '../BudgetForm';

export default function BudgetFormExample() {
  return (
    <BudgetForm
      onSave={(category, limit) => console.log('Save budget:', category, limit)}
    />
  );
}
