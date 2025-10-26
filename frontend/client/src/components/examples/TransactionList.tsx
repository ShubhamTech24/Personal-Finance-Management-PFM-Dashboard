import TransactionList from '../TransactionList';

// todo: remove mock functionality
const mockTransactions = [
  { transaction_id: '1', date: '2025-01-20', name: 'Grocery Store', amount: 45.32 },
  { transaction_id: '2', date: '2025-01-19', name: 'Salary Deposit', amount: -3500.00 },
  { transaction_id: '3', date: '2025-01-18', name: 'Coffee Shop', amount: 5.75 },
  { transaction_id: '4', date: '2025-01-17', name: 'Electric Bill', amount: 120.00 },
  { transaction_id: '5', date: '2025-01-16', name: 'Restaurant', amount: 62.50 },
];

export default function TransactionListExample() {
  return <TransactionList transactions={mockTransactions} />;
}
