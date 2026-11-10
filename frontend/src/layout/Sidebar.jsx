import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import TrendlyLogo from "../components/common/TrendlyLogo";
import {
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/matches", label: "Analytics", icon: <BarChart2 className="w-5 h-5" /> },
    { path: "/chat/lobby", label: "Trending Topics", icon: <TrendingUp className="w-5 h-5" /> },
    { path: "/planner", label: "Saved Items", icon: <Bookmark className="w-5 h-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Fixed Sidebar (lg+ screens) */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-black border-r border-slate-200 dark:border-zinc-900 p-6 justify-between select-none z-30 transition-colors duration-200 font-sans">
        <div className="space-y-8">
          {/* Brand Logo on Top */}
          <div className="pt-2">
            <TrendlyLogo to="/dashboard" />
          </div>

          {/* Navigation List */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold shadow-lg shadow-purple-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span className={active ? "text-white" : "text-slate-500 dark:text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Theme Toggle & Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-zinc-900 space-y-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#8B5CF6]" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-[#8B5CF6] font-bold uppercase">
              {theme}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-purple-500/30 dark:border-purple-500/50 hover:border-[#8B5CF6] bg-purple-500/5 hover:bg-purple-500/15 text-[#8B5CF6] hover:text-purple-700 dark:hover:text-purple-300 font-bold text-sm transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (< lg screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-900 px-1 py-1.5 flex items-center justify-around shadow-lg transition-colors duration-200 font-sans">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
                active
                  ? "text-[#8B5CF6] font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <span className={active ? "text-[#8B5CF6] scale-110" : ""}>
                {item.icon}
              </span>
              <span className="text-[10px] leading-tight truncate max-w-[50px]">{item.label}</span>
            </Link>
          );
        })}
        {/* Quick Theme Toggle for Mobile */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#8B5CF6] dark:hover:text-white cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#8B5CF6]" />}
          <span className="text-[10px] leading-tight">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </nav>
    </>
  );
}

export default Sidebar;
