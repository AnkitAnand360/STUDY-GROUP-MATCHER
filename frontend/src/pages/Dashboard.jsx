import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  Bell,
  ChevronDown,
  Users,
  ArrowUpRight,
  Bookmark,
  BarChart2,
  User,
  Zap,
  Sun,
  Moon,
} from "lucide-react";

const TRENDING_TOPICS = [
  { id: 1, rank: 1, tag: "🔥 AI in 2026", posts: "152K posts", change: "↑ 48%", color: "bg-purple-600/30 text-purple-400 border-purple-500/40" },
  { id: 2, rank: 2, tag: "↗ Web Development", posts: "98K posts", change: "↑ 32%", color: "bg-amber-500/30 text-amber-400 border-amber-500/40" },
  { id: 3, rank: 3, tag: "↗ MERN Stack", posts: "76K posts", change: "↑ 28%", color: "bg-yellow-500/30 text-yellow-400 border-yellow-500/40" },
  { id: 4, rank: 4, tag: "🔥 Cyber Security", posts: "61K posts", change: "↑ 24%", color: "bg-purple-600/30 text-purple-400 border-purple-500/40" },
  { id: 5, rank: 5, tag: "↗ Job Opportunities", posts: "55K posts", change: "↑ 20%", color: "bg-purple-600/30 text-purple-400 border-purple-500/40" },
];

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Ankit Anand", email: "ankit@aistudymatcher.io" };

  return (
    <div className="space-y-6 text-left select-none pb-12 transition-colors duration-200">
      
      {/* Top Header Bar matching the mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search trending topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 text-sm text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] shadow-sm transition-all"
          />
        </div>

        {/* Right Section: Notification, Theme Toggle & User Profile */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Quick Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2.5 rounded-xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:text-[#8B5CF6] dark:hover:text-white hover:border-[#8B5CF6]/50 shadow-sm transition-all cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-[#8B5CF6]" />
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative p-2.5 rounded-xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:text-[#8B5CF6] dark:hover:text-white shadow-sm transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 hover:border-[#8B5CF6]/50 shadow-sm transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs">
                {user.name ? user.name.charAt(0) : "A"}
              </div>
              <span className="text-sm font-bold text-black dark:text-white hidden sm:inline">
                {user.name || "Ankit Anand"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-xl p-2 z-50 transition-colors">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Account Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                >
                  Switch to {theme === "dark" ? "Light" : "Dark"} Mode
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-[#212A3D]" />
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards matching the image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Trending Now */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>🔥</span>
              <span>Trending Now</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">12.5K</span>
              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center">
                ↑ 12%
              </span>
            </div>
          </div>
          {/* Sparkline purple wave */}
          <svg className="w-20 h-10 overflow-visible" viewBox="0 0 80 40">
            <path
              d="M 0 30 Q 20 10 40 25 T 80 5"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 2: Active Users */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Users className="w-4 h-4 text-[#6366F1]" />
              <span>Active Users</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">48.7K</span>
              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center">
                ↑ 18%
              </span>
            </div>
          </div>
          {/* Sparkline blue wave */}
          <svg className="w-20 h-10 overflow-visible" viewBox="0 0 80 40">
            <path
              d="M 0 35 Q 25 20 45 28 T 80 8"
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 3: Total Views */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <BarChart2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Total Views</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">2.3M</span>
              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center">
                ↑ 24%
              </span>
            </div>
          </div>
          {/* Sparkline green wave */}
          <svg className="w-20 h-10 overflow-visible" viewBox="0 0 80 40">
            <path
              d="M 0 30 Q 30 35 50 15 T 80 5"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 4: Top Topic */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="text-amber-500 dark:text-amber-400">⭐</span>
              <span>Top Topic</span>
            </div>
            <div className="pt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">#AI</span>
            </div>
          </div>
          {/* 3D Glowing purple star badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-600 flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/40">
            ★
          </div>
        </div>

      </div>

      {/* Main Lower Grid matching mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Trending Topics (5 cols) */}
        <div className="lg:col-span-4 rounded-[26px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sm:p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Trending Topics</h3>
            <Link
              to="/chat/lobby"
              className="text-xs font-bold text-[#8B5CF6] hover:text-[#6366F1] flex items-center gap-1"
            >
              <span>See all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {TRENDING_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${topic.color}`}>
                    {topic.rank}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-black dark:text-white">
                      {topic.tag}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {topic.posts}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-extrabold text-[#8B5CF6]">
                  {topic.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Analytics Overview (5 cols) */}
        <div className="lg:col-span-5 rounded-[26px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sm:p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black dark:text-white">Analytics Overview</h3>
            <button
              onClick={() => setTimeRange(timeRange === "Last 7 Days" ? "Last 30 Days" : "Last 7 Days")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>{timeRange}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Line Graph */}
          <div className="relative pt-4 h-64 flex flex-col justify-between">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
              <div className="border-b border-purple-500/30 w-full" />
              <div className="border-b border-purple-500/30 w-full" />
              <div className="border-b border-purple-500/30 w-full" />
              <div className="border-b border-purple-500/30 w-full" />
            </div>

            {/* SVG Curve with dots */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 380 180">
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area */}
              <path
                d="M 15 140 Q 65 110 115 125 T 215 80 T 315 60 T 365 25 L 365 170 L 15 170 Z"
                fill="url(#analyticsGrad)"
              />

              {/* Glowing Line */}
              <path
                d="M 15 140 Q 65 110 115 125 T 215 80 T 315 60 T 365 25"
                fill="none"
                stroke="#A855F7"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]"
              />

              {/* Circular Nodes */}
              <circle cx="15" cy="140" r="4.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="75" cy="118" r="4.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="135" cy="122" r="4.5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="200" cy="88" r="5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="260" cy="70" r="4.5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="315" cy="60" r="4.5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="365" cy="25" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>

            {/* X-Axis labels Mon - Sun */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-zinc-800 relative z-10 px-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right Column: Your Quick Access & Go Pro (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Quick Access Card */}
          <div className="rounded-[26px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 shadow-sm p-5 space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Your Quick Access</h3>
            
            <Link
              to="/matches"
              className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-slate-100 dark:border-zinc-800/80"
            >
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-4 h-4 text-[#8B5CF6]" />
                <span>View Analytics</span>
              </div>
              <span className="text-slate-400">›</span>
            </Link>

            <Link
              to="/planner"
              className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-slate-100 dark:border-zinc-800/80"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-[#6366F1]" />
                <span>Save Trending Topics</span>
              </div>
              <span className="text-slate-400">›</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-slate-100 dark:border-zinc-800/80"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#8B5CF6]" />
                <span>Update Profile</span>
              </div>
              <span className="text-slate-400">›</span>
            </Link>
          </div>

          {/* Go Pro Card */}
          <div className="rounded-[26px] bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 dark:from-purple-900/40 dark:via-[#0F0D1C] dark:to-indigo-950/40 border border-purple-200 dark:border-purple-500/30 p-5 flex items-center justify-between shadow-sm dark:shadow-lg dark:shadow-purple-950/40 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-heading">Go Pro</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Unlock more features!
              </p>
            </div>

            <button
              onClick={() => alert("Go Pro unlocked for your account!")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Upgrade</span>
              <Zap className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
