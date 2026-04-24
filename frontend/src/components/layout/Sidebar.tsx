import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Bell,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { clsx } from "clsx";
import { useLogoutMutation } from "../../store/api/authApi";
import toast from "react-hot-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Receipt, label: "Expenses", to: "/expenses" },
  { icon: Wallet, label: "Budgets", to: "/budget" },
  { icon: Bell, label: "Alerts", to: "/alerts" },
  { icon: MessageSquare, label: "AI Assistant", to: "/ai-assistant" },
];
type Props = {
  isMobileOpen: boolean;
  onClose: () => void;
};
const Sidebar = ({ isMobileOpen, onClose }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadAlerts = useSelector((state) => state.alerts.unreadCount);
  const [logOut] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      dispatch(logout());
      toast.success("Successfully logged out");
      setTimeout(navigate, 0, "/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 min-[1200px]:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-app z-50 transition-transform duration-300 transform min-[1200px]:translate-x-0 flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">SpendWise</h1>
          </div>
          <button
            onClick={onClose}
            className="min-[1200px]:hidden p-2 hover:bg-muted/10 rounded-lg"
          >
            <X className="w-5 h-5 text-muted-app" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => window.innerWidth < 1200 && onClose()}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-app hover:bg-primary/10 hover:text-primary",
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.label === "Alerts" && unreadAlerts > 0 && (
                <span className="ml-auto bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-surface">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-app">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-app cursor-pointer hover:bg-danger/10 hover:text-danger transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
