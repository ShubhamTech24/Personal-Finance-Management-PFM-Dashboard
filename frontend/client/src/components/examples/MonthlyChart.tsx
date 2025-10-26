import MonthlyChart from '../MonthlyChart';

// todo: remove mock functionality
const mockData = [
  { month: 'Aug', income: 3500, expense: 2800 },
  { month: 'Sep', income: 3500, expense: 3200 },
  { month: 'Oct', income: 3500, expense: 2600 },
  { month: 'Nov', income: 4000, expense: 3100 },
  { month: 'Dec', income: 3500, expense: 3500 },
  { month: 'Jan', income: 3500, expense: 2900 },
];

export default function MonthlyChartExample() {
  return <MonthlyChart data={mockData} />;
}
