import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import Loader from "../components/ui/Loader";

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalGroups: 0,
  });
  const [partnerCount, setPartnerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pomodoro Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Pomodoro Countdown Logic
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            alert("Pomodoro session completed! Time for a short break.");
            setMinutes(25);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const dashRes = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: token },
      });
      setMetrics(dashRes.data);

      const matchRes = await axios.get("http://localhost:5000/api/match", {
        headers: { Authorization: token },
      });
      setPartnerCount(matchRes.data.length);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  if (loading) {
    return <Loader variant="spinner" className="h-96" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 text-left"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight text-white m-0">
            Developer Workspace
          </h1>
          <p className="text-gray-400 mt-1">
            Overview of your study plans, streaks, groups, and AI match recommendations.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/profile")}>
          Edit Profile
        </Button>
      </div>

      {/* Gamification Indicator Panel */}
      <Card hoverable={false} glowColor="purple" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Level Progress */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-baseline select-none">
              <span className="text-sm font-extrabold uppercase text-purple-400 tracking-wider">
                Level 3 Student
              </span>
              <span className="text-xs text-gray-500 font-bold">240 / 500 XP to Level 4</span>
            </div>
            <ProgressBar value={240} max={500} showPercentage={false} />
          </div>

          {/* Streaks & Badges */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl text-purple-300 font-bold text-xs select-none">
              🔥 8 Day Streak
            </div>
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl text-cyan-300 font-bold text-xs select-none">
              ⚡ Speed Runner
            </div>
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-indigo-300 font-bold text-xs select-none">
              🎯 Top Solver
            </div>
          </div>
        </div>
      </Card>

      {/* SaaS Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <Card hoverable={true} className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-2xl select-none mb-2">🔥</span>
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              Study Streak
            </h4>
            <p className="text-2xl font-black font-numeric text-white mt-1">
              8 Days
            </p>
          </div>
        </Card>

        {/* Tasks Count */}
        <Card hoverable={true} className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-2xl select-none mb-2">📚</span>
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              Total Tasks
            </h4>
            <p className="text-2xl font-black font-numeric text-white mt-1">
              {metrics.totalTasks} Tasks
            </p>
          </div>
        </Card>

        {/* Partners */}
        <Card hoverable={true} className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-2xl select-none mb-2">👥</span>
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              AI Partners
            </h4>
            <p className="text-2xl font-black font-numeric text-white mt-1">
              {partnerCount} Peers
            </p>
          </div>
        </Card>

        {/* Groups */}
        <Card hoverable={true} className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-2xl select-none mb-2">💬</span>
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              Active Groups
            </h4>
            <p className="text-2xl font-black font-numeric text-white mt-1">
              {metrics.totalGroups} Rooms
            </p>
          </div>
        </Card>
      </div>

      {/* Main Charts & Pomodoro section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress & Area Chart */}
        <div className="md:col-span-2 space-y-6">
          {/* Area Chart Card */}
          <Card hoverable={false} className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Study Time & Focus Metrics
            </h3>
            {/* SVG Area Chart */}
            <div className="relative">
              <svg className="w-full h-44 text-purple-500" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(124, 58, 237)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="rgb(124, 58, 237)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q30,70 60,88 T120,40 T180,65 T240,25 T300,50 L300,100 L0,100 Z" fill="url(#area-grad)" />
                <path d="M0,80 Q30,70 60,88 T120,40 T180,65 T240,25 T300,50" stroke="rgb(124, 58, 237)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 border-b border-dashed border-gray-800/60 pointer-events-none -z-10 h-1/2"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-extrabold uppercase mt-4 select-none">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </Card>

          {/* GitHub Style Study Map Heatmap */}
          <Card hoverable={false} className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Weekly Activity Map
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Track study plan check-off tasks completed daily over the past weeks.
            </p>
            {/* Heatmap Grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pr-1 py-1">
              {Array.from({ length: 49 }).map((_, idx) => {
                const colors = [
                  "bg-gray-850",
                  "bg-purple-950/40",
                  "bg-purple-800/60",
                  "bg-purple-600",
                  "bg-cyan-950/30",
                  "bg-cyan-800/60",
                  "bg-cyan-500",
                ];
                const col = colors[Math.floor(Math.random() * colors.length)];
                return <div key={idx} className={`w-3.5 h-3.5 rounded-sm ${col}`}></div>;
              })}
            </div>
          </Card>
        </div>

        {/* Right side: Pomodoro Timer & Donut Chart */}
        <div className="space-y-6">
          {/* Pomodoro Timer widget */}
          <Card hoverable={false} className="p-6 flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Focus Session Timer
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Organize study intervals with Pomodoro counters.
              </p>

              <div className="flex flex-col items-center justify-center py-5 bg-gray-900/60 rounded-2xl border border-gray-800/60">
                <span className="text-4xl font-black font-numeric text-white select-none tabular-nums">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-purple-500 mt-2">
                  {isActive ? "Stay Focused 🎯" : "Ready to study"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={toggleTimer}
                variant={isActive ? "outline" : "primary"}
                className="flex-1"
              >
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline" className="px-4">
                Reset
              </Button>
            </div>
          </Card>

          {/* Donut Chart: Skills distribution */}
          <Card hoverable={false} className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Topics Breakdown
            </h3>
            <div className="flex items-center justify-between gap-4">
              {/* SVG Donut */}
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 text-cyan-400" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="45 55" strokeDashoffset="25" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="75" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="5" />
                </svg>
                <div className="absolute text-center select-none">
                  <span className="text-lg font-black font-numeric text-white">3</span>
                  <p className="text-[8px] uppercase text-gray-500 font-bold">Topics</p>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span className="text-gray-300 font-semibold">React (45%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span className="text-gray-300 font-semibold">DSA (30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-gray-300 font-semibold">Node (25%)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;