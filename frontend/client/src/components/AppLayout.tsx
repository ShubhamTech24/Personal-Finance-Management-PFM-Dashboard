import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, BarChart2, LogOut, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onLinkBank?: () => void;
}

export default function AppLayout({ children, onLogout, onLinkBank }: AppLayoutProps) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-card-border flex flex-col p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">PFM Dashboard</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard">
            <button
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover-elevate ${
                isActive("/dashboard")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-foreground"
              }`}
              data-testid="link-dashboard"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </Link>
          
          <Link href="/accounts">
            <button
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover-elevate ${
                isActive("/accounts")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-foreground"
              }`}
              data-testid="link-accounts"
            >
              <Wallet size={18} />
              <span>Accounts</span>
            </button>
          </Link>
          
          <Link href="/budgets">
            <button
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover-elevate ${
                isActive("/budgets")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-foreground"
              }`}
              data-testid="link-budgets"
            >
              <BarChart2 size={18} />
              <span>Budgets</span>
            </button>
          </Link>
        </nav>

        <div className="space-y-2 pt-4 border-t border-border">
          {onLinkBank && (
            <Button
              onClick={onLinkBank}
              className="w-full bg-chart-2 hover:bg-chart-2/90 text-white"
              data-testid="button-link-bank"
            >
              <Link2 size={16} className="mr-2" />
              Link Bank
            </Button>
          )}
          <Button
            onClick={onLogout}
            variant="secondary"
            className="w-full"
            data-testid="button-logout"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-card-border px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Welcome back 👋</h2>
          <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
