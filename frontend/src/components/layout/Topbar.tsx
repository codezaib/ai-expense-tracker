import React, { use, useState } from "react";
import { Menu, Bell, Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../../store/index.js";
import { useGetAlertsQuery } from "../../store/api/alertsApi.js";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../store/api/authApi.js";
import { toast } from "react-hot-toast";
type Props = {
  onOpenMobileMenu: () => void;
};
const Topbar = ({ onOpenMobileMenu }: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: alertsResponse, isLoading, isError } = useGetAlertsQuery();
  const alerts = alertsResponse?.alerts ?? [];
  const unreadCount = alerts.filter((a: any) => !a.is_read).length;
  const location = useLocation();

  const navigate = useNavigate();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Overview";
    if (path === "/expenses") return "Expenses";
    if (path === "/budget") return "Budgets";
    if (path === "/alerts") return "Alerts";
    if (path === "/ai-assistant") return "AI Assistant";
    return "SpendWise";
  };
  // in Topbar
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/expenses?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 min-[1200px]:left-64 h-20 bg-app/80 backdrop-blur-xl border-b border-app z-30 flex items-center justify-between px-6 min-[1200px]:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="min-[1200px]:hidden p-2 hover:bg-muted/10 rounded-lg"
        >
          <Menu className="w-6 h-6 text-muted-app" />
        </button>
        <h2 className="text-xl font-bold tracking-tight">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4 min-[1200px]:gap-6">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-app group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-surface border border-app rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <button
          className="relative p-2 hover:bg-muted/10 rounded-full transition-colors cursor-pointer"
          onClick={() => setTimeout(navigate, 0, "/alerts")}
        >
          <Bell className="w-5 h-5 text-muted-app" />
          {unreadCount > 0 && (
            <span className="absolute bg-red-500 top-1 right-2 w-3 h-3  text-xs rounded-full flex items-center justify-center"></span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-app">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">
              {user?.name || "Guest User"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/60 p-0.5 shadow-lg shadow-primary/20 relative">
            <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center overflow-hidden">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
