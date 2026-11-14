import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrendlyAuthModal from "../components/auth/TrendlyAuthModal";
import {
  ArrowRight,
  Sparkles,
  Brain,
  MessageSquare,
  Calendar,
  Shield,
  Users,
  Mail,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

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
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              Track What's <br />
              <span className="bg-gradient-to-r from-[#A855F7] via-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">
                Trending
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-normal">
              Your all-in-one dashboard to explore trending topics, analytics and insights.
            </p>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => setModalMode("register")}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto text-center px-7 sm:px-8 py-3.5 rounded-full border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-800 dark:text-white font-semibold text-sm sm:text-base transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Quick Metrics Underneath */}
            <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap sm:flex-nowrap items-center gap-5 sm:gap-8">
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

      {/* Features Section (#features) */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200 dark:border-white/10 relative z-10 scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-[#8B5CF6]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white m-0">
            Engineered for High-Synergy Study Groups
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Eliminate solo study burnout with AI-driven partner recommendations, synchronized study schedules, and private peer rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 hover:border-[#8B5CF6]/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all text-left group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] text-white flex items-center justify-center mb-5 shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Gemini AI Matching
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Deep semantic evaluation computes compatibility scores across programming languages, topics, and exam goals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 hover:border-[#8B5CF6]/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all text-left group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#38BDF8] text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Moderated Study Rooms
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Admin-controlled group chats featuring direct invite links, student roles, and instant message moderation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 hover:border-[#8B5CF6]/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all text-left group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center mb-5 shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Smart Availability Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Coordinate weekday and weekend timetables seamlessly so everyone stays on track for deadlines.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 hover:border-[#8B5CF6]/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all text-left group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#3B82F6] text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Verified Student Profiles
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Safe community with real university accounts, verified skills, and academic integrity built-in.
            </p>
          </div>
        </div>
      </section>

      {/* About Section (#about) */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200 dark:border-white/10 relative z-10 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-[#6366F1]">
              <Users className="w-3.5 h-3.5" />
              <span>About AI Study Matcher</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white m-0">
              Transforming How Students Learn Together
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              Finding the right study group has always been hit or miss. We created AI Study Matcher to pair students based on actual curriculum overlap, complementary coding and mathematical skills, and matching study habits.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Matches based on genuine technical strengths and learning gaps.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Instant study room generation with full privacy and admin controls.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Built-in Gemini AI study assistant for answering technical questions.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-left">
              <div className="text-3xl font-black font-heading text-[#8B5CF6] mb-1">96%</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Compatibility Score</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Average alignment between matched study partners</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-left">
              <div className="text-3xl font-black font-heading text-[#6366F1] mb-1">100%</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Free for Students</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Open peer learning network built for universities</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-left">
              <div className="text-3xl font-black font-heading text-emerald-500 mb-1">24/7</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">AI Study Assistant</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Integrated Gemini intelligence for homework help</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-left">
              <div className="text-3xl font-black font-heading text-amber-500 mb-1">5,000+</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Study Hours Logged</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Empowering collaborative engineering exam prep</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (#contact) */}
      <section
        id="contact"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200 dark:border-white/10 relative z-10 scroll-mt-24"
      >
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-[#8B5CF6]">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect & Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white m-0">
            Get in Touch With Us
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Have feature suggestions, university partnership inquiries, or need support? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Email Support Card */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#8B5CF6] flex items-center justify-center mb-4 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Email Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">For platform assistance & inquiries</p>
            </div>
            <a
              href="mailto:support@aistudymatcher.io"
              className="mt-6 text-xs font-bold text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
            >
              <span>support@aistudymatcher.io</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Instagram Profile Card */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4 font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Instagram</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct message on Instagram</p>
            </div>
            <a
              href="https://www.instagram.com/ankit_._anand/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-xs font-bold text-pink-500 hover:underline inline-flex items-center gap-1"
            >
              <span>@ankit_._anand</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Community GitHub Card */}
          <div className="rounded-3xl p-6 bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white flex items-center justify-center mb-4 font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">GitHub</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Open source repository & code</p>
            </div>
            <a
              href="https://github.com/AnkitAnand360/STUDY-GROUP-MATCHER"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-xs font-bold text-slate-800 dark:text-white hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6] inline-flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
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