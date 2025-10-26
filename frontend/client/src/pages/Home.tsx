export default function Home() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to Your Personal Finance Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Track your spending, manage budgets, and gain insights into your financial health.
          Start by linking your bank account or exploring the dashboard.
        </p>
      </div>
    </div>
  );
}
