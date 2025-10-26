import SpendingChart from '../SpendingChart';

// todo: remove mock functionality
const mockData = [
  { name: 'Food', value: 450 },
  { name: 'Transport', value: 200 },
  { name: 'Entertainment', value: 150 },
  { name: 'Utilities', value: 300 },
  { name: 'Shopping', value: 250 },
];

export default function SpendingChartExample() {
  return <SpendingChart data={mockData} />;
}
