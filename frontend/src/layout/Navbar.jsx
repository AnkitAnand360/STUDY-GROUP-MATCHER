import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/matches", label: "AI Matchmaker" },
    { path: "/planner", label: "Daily Planner" },
    { path: "/chat/lobby", label: "Study Groups" },
    { path: "/profile", label: "Profile" },
    { path: "/settings", label: "Settings" },
  ];

  const isActive = (path) => {
    if (path === "/chat/lobby") {
      return location.pathname.startsWith("/chat");
    }
    return location.pathname === path;
  };

  return (
    <header
      className={`flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800 w-full z-30 select-none ${
        token ? "fixed top-0 left-0 lg:hidden" : "sticky top-0"
      }`}
    >
      <Link to="/" className="flex items-center">
        <h1 className="text-xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent m-0 tracking-tight">
         AI-Study-Group-Matcher
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {token ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="text-gray-550 dark:text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-xl transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className={`font-semibold hover:text-purple-650 transition-colors text-sm ${
                isActive("/") ? "text-purple-600 border-b-2 border-purple-600 pb-0.5" : "text-gray-650 dark:text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`font-semibold hover:text-purple-650 transition-colors text-sm ${
                isActive("/login") ? "text-purple-600 border-b-2 border-purple-600 pb-0.5" : "text-gray-650 dark:text-gray-300"
              }`}
            >
              Login
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary">
                Register
              </Button>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-xl text-sm transition-colors cursor-pointer text-gray-550 dark:text-gray-400"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {token && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[57px] bg-black z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-[57px] bottom-0 w-72 bg-white dark:bg-gray-900 border-l border-gray-150 dark:border-gray-800 p-6 flex flex-col justify-between z-50 overflow-y-auto"
            >
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        active
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-305"
                          : "text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-gray-555 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                  <span>{theme === "dark" ? "☀️" : "🌙"}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
