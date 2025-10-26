import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Wallet, BarChart2, LogOut, Link2 } from "lucide-react";

export default function Layout({ onLogout, onLinkBank }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">PFM Dashboard</h1>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Wallet size={18} /> Accounts
          </NavLink>
          <NavLink
            to="/budgets"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BarChart2 size={18} /> Budgets
          </NavLink>
        </nav>

        <div className="mt-auto space-y-2">
          <button
            onClick={onLinkBank}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
          >
            <Link2 size={16} /> Link Bank
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <header className="flex justify-between items-center bg-white shadow px-8 py-4 sticky top-0">
          <h2 className="text-lg font-semibold">Welcome back 👋</h2>
          <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
