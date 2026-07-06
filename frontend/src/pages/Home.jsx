import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

function Home() {
  const navigate = useNavigate();

  // Stats definition
  const stats = [
    {
      value: "12,000+",
      label: "Active Students",
      icon: "👥",
      color: "purple",
      chart: (
        <svg className="w-24 h-8 text-purple-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 25 C 20 20, 40 28, 60 10 C 80 0, 90 5, 100 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: "3,500+",
      label: "Study Groups",
      icon: "📚",
      color: "blue",
      chart: (
        <svg className="w-24 h-8 text-indigo-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 28 C 15 25, 30 15, 50 18 C 70 20, 85 5, 100 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: "98%",
      label: "AI Match Accuracy",
      icon: "🧠",
      color: "cyan",
      chart: (
        <svg className="w-24 h-8 text-cyan-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 20 C 20 18, 40 10, 60 12 C 80 15, 90 2, 100 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: "25,000+",
      label: "Sessions Completed",
      icon: "🔥",
      color: "purple",
      chart: (
        <svg className="w-24 h-8 text-purple-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 29 C 15 28, 30 20, 45 22 C 60 25, 80 5, 100 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  // Features list
  const features = [
    {
      title: "🧠 AI Smart Matching",
      description: "Gemini AI analyzes your specific skills, knowledge gaps, and study goals to find highly compatible peers.",
      color: "purple",
    },
    {
      title: "📅 Schedule Matching",
      description: "No more scheduling conflicts. Match with peers who are free during your preferred days and time slots.",
      color: "blue",
    },
    {
      title: "💬 Real-time Chat",
      description: "Real-time socket messaging, typing indicators, and channels designed specifically for study discussions.",
      color: "cyan",
    },
    {
      title: "📈 Progress Tracking",
      description: "Set tasks, track your daily schedule agendas, and watch your study streaks grow over time.",
      color: "purple",
    },
    {
      title: "🏆 Leaderboards",
      description: "Earn XP points for completing study sessions, check off tasks, and compete with friends on the leaderboard.",
      color: "blue",
    },
    {
      title: "📚 Resource Sharing",
      description: "Upload study guides, PDF notes, code snippets, and research materials directly within your group rooms.",
      color: "cyan",
    },
    {
      title: "🎥 Video Study Rooms",
      description: "Launch built-in study sessions, coordinate with peers, and set Pomodoro timers to stay focused.",
      color: "purple",
    },
    {
      title: "🤖 AI Study Assistant",
      description: "Instant access to a Gemini-powered tutor side panel inside chat rooms to ask questions and generate coding tasks.",
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white relative overflow-x-hidden pt-12 md:pt-16 pb-20 grid-bg">
      {/* Background Aurora Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob-1"></div>
        <div className="aurora-blob-2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-5 space-y-28">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left pt-6">
          {/* Left Side Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-xs font-bold select-none">
              <span>🚀</span> AI Powered Study Matching
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight tracking-tight text-white m-0">
              Find Your Perfect <br />
              <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Study Partner
              </span>{" "}
              with AI
            </h1>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
              StudyMatch AI uses advanced Gemini reasoning to analyze your skills, subjects, and study availability, matching you with compatible peers in real time.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/login")}>
                Find Matches
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-gray-800/80 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-black font-numeric text-white">12k+</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Students</p>
              </div>
              <div>
                <p className="text-2xl font-black font-numeric text-purple-400">98%</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black font-numeric text-cyan-400">50+</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Universities</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side Illustration: Interactive Match Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex justify-center items-center h-[350px] md:h-[400px]"
          >
            {/* Ambient Glow Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full filter blur-3xl -z-10" />

            {/* Simulated Live Matching Node Cards */}
            <div className="relative w-full max-w-sm flex items-center justify-between select-none">
              {/* User A Card */}
              <div className="glass-panel border-purple-500/20 p-4 rounded-2xl w-32 shadow-[0_0_20px_rgba(124,58,237,0.1)] absolute left-0 top-10 text-center animate-bounce duration-3000">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-extrabold mx-auto mb-2 shadow-md">
                  A
                </div>
                <h4 className="text-xs font-bold text-white truncate">Ankit A.</h4>
                <p className="text-[9px] text-purple-300 font-extrabold uppercase mt-1">React, DSA</p>
              </div>

              {/* Connecting Pulse SVG Line */}
              <svg className="w-full h-40 absolute inset-0 -z-10" viewBox="0 0 300 200">
                <path
                  d="M60,110 C120,70 180,170 240,110"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.4)"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
                <circle cx="150" cy="115" r="4" fill="#06B6D4" className="animate-ping" />
              </svg>

              {/* Match Percentage Indicator */}
              <div className="absolute left-[38%] top-[38%] bg-gradient-to-tr from-purple-600 to-cyan-500 px-3 py-1.5 rounded-full text-xs font-black shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/50">
                98% Match
              </div>

              {/* User B Card */}
              <div className="glass-panel border-cyan-500/20 p-4 rounded-2xl w-32 shadow-[0_0_20px_rgba(6,182,212,0.1)] absolute right-0 bottom-10 text-center animate-bounce duration-2000">
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-extrabold mx-auto mb-2 shadow-md">
                  S
                </div>
                <h4 className="text-xs font-bold text-white truncate">Sophia R.</h4>
                <p className="text-[9px] text-cyan-300 font-extrabold uppercase mt-1">React, Node</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-black font-heading tracking-tight text-white m-0">
              Trusted by Learning Groups Everywhere
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                glowColor={stat.color}
                className="flex flex-col justify-between p-6 min-h-[160px]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl select-none">{stat.icon}</span>
                    <h3 className="text-3xl font-black font-numeric mt-2 tracking-tight text-white">
                      {stat.value}
                    </h3>
                  </div>
                  {stat.chart}
                </div>
                <p className="text-xs text-gray-500 uppercase font-extrabold tracking-wider mt-4">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white m-0">
              World-Class SaaS Features
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Designed with a premium dark layout, custom AI recommenders, and comprehensive real-time interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <Card
                key={idx}
                glowColor={feat.color}
                className="p-6 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider mt-4 block">
                  StudyMatch Pro &rarr;
                </span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;