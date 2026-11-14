import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import TrendlyLogo from "../components/common/TrendlyLogo";
import { LayoutDashboard, LogOut, Sun, Moon, Menu, X } from "lucide-react";

function Navbar({ onOpenLogin, onOpenRegister }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
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

  // Track active section on scroll when on home page
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      const sections = ["contact", "about", "features"];
      let current = "home";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = sectionId;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { id: "home", label: "Home", href: "/" },
    { id: "features", label: "Features", href: "#features" },
    { id: "about", label: "About", href: "#about" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  const isLinkActive = (id) => {
    if (location.pathname === "/") {
      return activeSection === id;
    }
    return false;
  };

  const scrollToSection = (e, sectionId) => {
    if (location.pathname === "/") {
      e.preventDefault();
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          const navOffset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - navOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          setActiveSection(sectionId);
        }
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-40 backdrop-blur-xl bg-white/90 dark:bg-black/90 border-b border-slate-200 dark:border-white/10 select-none transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center shrink-0">
          <TrendlyLogo
            to="/"
            textClassName="text-base sm:text-lg md:text-xl font-bold tracking-tight"
            iconSize="w-7 h-7 sm:w-8 sm:h-8"
            svgSize="w-3.5 h-3.5 sm:w-4 sm:h-4"
          />
        </div>

        {/* Center Navigation Links: Desktop & Tablet (Home, Features, About, Contact) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.id);
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`text-sm font-semibold transition-all relative py-1 cursor-pointer whitespace-nowrap ${
                  active
                    ? "text-[#8B5CF6] dark:text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="desktopNavUnderline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B5CF6] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}

          {token && (
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-all relative py-1 ${
                location.pathname.startsWith("/dashboard")
                  ? "text-[#8B5CF6] dark:text-[#8B5CF6] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#8B5CF6] after:rounded-full"
                  : "text-[#8B5CF6] hover:opacity-80"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side: Auth Actions & Theme toggle */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3 shrink-0">
          {token ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 dark:bg-purple-500/20 text-[#8B5CF6] border border-purple-500/30 hover:bg-purple-500/20 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dashboard</span>
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
            <div className="flex items-center gap-2">
              {onOpenLogin ? (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all"
                >
                  Login
                </Link>
              )}

              {onOpenRegister ? (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-95 shadow-md shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Register
                </button>
              ) : (
                <Link
                  to="/register"
                  className="px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-95 shadow-md shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Register
                </Link>
              )}
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={theme === "dark" ? "Light theme" : "Dark theme"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
          </button>
        </div>

        {/* Mobile Top Controls: Theme Toggle + Menu Button */}
        <div className="flex items-center gap-1.5 md:hidden">
          {/* Quick Login pill on mobile when not signed in */}
          {!token && (
            <Link
              to="/login"
              className="sm:hidden px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all"
            >
              Login
            </Link>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Responsive Navigation Strip: Home, Features, About, Contact (Always accessible) */}
      <div className="md:hidden w-full border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-black/95 px-3 py-2 flex items-center justify-around gap-2 overflow-x-auto no-scrollbar select-none">
        {navLinks.map((link) => {
          const active = isLinkActive(link.id);
          return (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.id)}
              className={`text-xs font-semibold relative py-1 px-2.5 transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? "text-[#8B5CF6] dark:text-white font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {link.label}
              {active && (
                <motion.span
                  layoutId="mobileNavUnderline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B5CF6] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
        {token && (
          <Link
            to="/dashboard"
            className={`text-xs font-semibold relative py-1 px-2.5 transition-colors whitespace-nowrap ${
              location.pathname.startsWith("/dashboard")
                ? "text-[#8B5CF6] dark:text-white font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#8B5CF6] after:rounded-full"
                : "text-[#8B5CF6]"
            }`}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-black/98 backdrop-blur-2xl px-4 py-4 space-y-2.5"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.id);
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? "bg-purple-500/10 text-[#8B5CF6] dark:text-white font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />}
                </a>
              );
            })}

            {token ? (
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-md shadow-purple-500/25"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-xs font-bold text-red-500 hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] shadow-md shadow-purple-500/30 transition-all"
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
