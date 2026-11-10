import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrendlyAuthModal from "../components/auth/TrendlyAuthModal";
import { ArrowRight } from "lucide-react";

function Home() {
  const [modalMode, setModalMode] = useState(null); // null | "login" | "register"

  return (
    <div className="w-full relative min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden select-none transition-colors duration-200">
      
      {/* Neon Aurora Glow Curves in Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        
        {/* Curved ambient neon lines */}
        <svg className="absolute w-full h-full opacity-25" viewBox="0 0 1440 900" fill="none">
          <path
            d="M-100 450 C 300 250, 700 700, 1540 350"
            stroke="url(#lineGrad1)"
            strokeWidth="2.5"
            strokeDasharray="6 8"
          />
          <path
            d="M-50 650 C 400 400, 900 850, 1500 500"
            stroke="url(#lineGrad2)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
              <stop offset="70%" stopColor="#C084FC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Hero Section matching the image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left space-y-7"
          >
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              Track What's <br />
              <span className="bg-gradient-to-r from-[#A855F7] via-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">
                Trending
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-normal">
              Your all-in-one dashboard to explore trending topics, analytics and insights.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setModalMode("register")}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer font-sans"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-full border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-800 dark:text-white font-semibold text-sm sm:text-base transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Quick Metrics Underneath */}
            <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex items-center gap-8">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">12.5K+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Trending Topics</div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">48.7K+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Active Creators</div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">2.3M+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Insights</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Holographic Graph Card from Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            {/* Glowing back halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 rounded-3xl blur-2xl transform scale-95" />

            {/* Main Futuristic Card Container with 3D tilt */}
            <div className="relative w-full max-w-[540px] rounded-[32px] p-6 sm:p-7 bg-white/90 dark:bg-[#101524]/90 backdrop-blur-2xl border border-slate-200 dark:border-[#232D44] shadow-xl dark:shadow-2xl dark:shadow-purple-950/50 overflow-hidden transition-colors">
              
              {/* Card Header: Trending Now Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#182033] border border-slate-200 dark:border-[#2B3754] text-xs font-bold text-slate-800 dark:text-white shadow-sm">
                  <span>🔥</span>
                  <span>Trending Now</span>
                </div>
              </div>

              {/* Glowing Interactive Line Chart Representation */}
              <div className="relative h-56 w-full rounded-2xl bg-slate-50 dark:bg-[#0D1220]/80 border border-slate-200 dark:border-[#1E273D] p-4 flex flex-col justify-between overflow-hidden">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                  <div className="border-b border-purple-500/40 w-full" />
                  <div className="border-b border-purple-500/40 w-full" />
                  <div className="border-b border-purple-500/40 w-full" />
                  <div className="border-b border-purple-500/40 w-full" />
                </div>

                {/* SVG Line Graph matching the image */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 460 160">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chartStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>

                  {/* Filled Area */}
                  <path
                    d="M 10 130 Q 80 40 140 90 T 260 50 T 360 80 T 450 30 L 450 160 L 10 160 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* Glowing Stroke */}
                  <path
                    d="M 10 130 Q 80 40 140 90 T 260 50 T 360 80 T 450 30"
                    fill="none"
                    stroke="url(#chartStroke)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                  />

                  {/* Glowing Data Point Circles */}
                  <circle cx="10" cy="130" r="4.5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="95" cy="55" r="4.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="165" cy="85" r="4.5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="260" cy="50" r="5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="2.5" className="animate-pulse" />
                  <circle cx="360" cy="80" r="4.5" fill="#818CF8" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="450" cy="30" r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2.5" />
                </svg>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1C2539] relative z-10">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* Bottom Cards: Bar Charts & Holographic Globe */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                
                {/* 3D Bar Chart Preview */}
                <div className="p-4 rounded-2xl bg-[#0D1220]/80 border border-[#1E273D] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300">Volume</span>
                    <span className="text-[10px] text-emerald-400 font-extrabold">+32%</span>
                  </div>
                  <div className="flex items-end justify-between h-16 gap-2 px-1">
                    <div className="w-3 rounded-t-md bg-[#25304C] h-[40%]" />
                    <div className="w-3 rounded-t-md bg-[#384872] h-[65%]" />
                    <div className="w-3 rounded-t-md bg-purple-600 h-[85%]" />
                    <div className="w-3 rounded-t-md bg-indigo-500 h-[50%]" />
                    <div className="w-3 rounded-t-md bg-cyan-400 h-[100%]" />
                  </div>
                </div>

                {/* Holographic Glowing Globe Preview */}
                <div className="p-4 rounded-2xl bg-[#0D1220]/80 border border-[#1E273D] flex items-center justify-center relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 relative flex items-center justify-center shadow-lg shadow-purple-500/40 animate-spin" style={{ animationDuration: "25s" }}>
                    <div className="w-16 h-16 rounded-full bg-[#0D1220] flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-purple-500/20 rounded-2xl pointer-events-none" />
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Interactive Modal Popup for Login & Register (matching top-right of image) */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[440px]"
            >
              <TrendlyAuthModal
                initialMode={modalMode}
                onClose={() => setModalMode(null)}
                onSwitchMode={(newMode) => setModalMode(newMode)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Home;