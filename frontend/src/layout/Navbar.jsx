import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import TrendlyLogo from "../components/common/TrendlyLogo";
import { LayoutDashboard, LogOut, Sun, Moon, Menu, X } from "lucide-react";

function Navbar({ onOpenLogin, onOpenRegister }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 w-full z-40 backdrop-blur-xl bg-white/90 dark:bg-black/90 border-b border-slate-200 dark:border-white/10 select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center">
          <TrendlyLogo to="/" />
        </div>

        {/* Center Navigation Links: Home, Features, About, Contact */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold transition-all relative py-1 ${
              isActive("/")
                ? "text-purple-600 dark:text-white font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 dark:after:bg-purple-500 after:rounded-full"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Home
          </Link>

          <a
            href="#features"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Contact
          </a>

          {token && (
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-all relative py-1 ${
                isActive("/dashboard")
                  ? "text-purple-600 dark:text-purple-400 font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 dark:after:bg-purple-500 after:rounded-full"
                  : "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side: Login & Register Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 dark:bg-purple-500/20 text-[#8B5CF6] border border-purple-500/30 hover:bg-purple-500/20 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {onOpenLogin ? (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-6 py-2 rounded-full text-sm font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full text-sm font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all"
                >
                  Login
                </Link>
              )}

              {onOpenRegister ? (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-6 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-95 shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Register
                </button>
              ) : (
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-95 shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Register
                </Link>
              )}
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ml-1"
            title={theme === "dark" ? "Light theme" : "Dark theme"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
          </button>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-2xl px-4 py-5 space-y-3"
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
            >
              Contact
            </a>

            {token ? (
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-purple-600 text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 shadow-md shadow-purple-500/30"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
