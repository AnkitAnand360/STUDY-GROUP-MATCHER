import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

function StuddyPlanner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pomodoro mini timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Calendar dates view
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -2; i <= 2; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        label: d.toLocaleDateString([], { weekday: "short" }),
        dayNum: d.getDate(),
        isoDate: d.toISOString().split("T")[0],
      });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  useEffect(() => {
    fetchPlanForDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Pomodoro countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setTimerActive(false);
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
  }, [timerActive, seconds, minutes]);

  const fetchPlanForDate = async (dateStr) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/planner/today", {
        headers: {
          Authorization: token,
        },
      });

      const fetchedPlan = response.data;
      if (fetchedPlan && fetchedPlan.date === dateStr) {
        setPlan(fetchedPlan);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch study plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/planner/generate",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPlan(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate study plan. Make sure you set your skills and subjects in your Profile!"
      );
    }
  };

  const handleToggleTask = async (taskId) => {
    if (!plan) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/planner/${plan._id}/${taskId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPlan(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = plan?.tasks
    ? plan.tasks.filter((t) => t.completed).length
    : 0;
  const totalCount = plan?.tasks ? plan.tasks.length : 0;

  return (
    <div className="space-y-8 text-left">
      {/* Header & Mini Pomodoro Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight text-white m-0">
            Daily AI Study Planner
          </h1>
          <p className="text-gray-400 mt-1">
            Gemini structured study schedules based on your profile topic focus areas.
          </p>
        </div>

        {/* Mini Pomodoro Toggle Widget */}
        <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto select-none">
          <span className="text-lg font-bold font-numeric text-white tabular-nums">
            ⏱️ {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <Button
            size="sm"
            variant={timerActive ? "outline" : "primary"}
            onClick={() => setTimerActive(!timerActive)}
            className="py-1 px-3 text-xs"
          >
            {timerActive ? "Pause" : "Focus"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950 text-red-300 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Calendar Strip Selector */}
      <Card hoverable={false} className="p-4">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-3 select-none">
          Calendar Schedule
        </h4>
        <div className="flex justify-between md:justify-start md:gap-4 gap-2">
          {calendarDays.map((day) => {
            const isSelected = selectedDate === day.isoDate;
            const isToday =
              new Date().toISOString().split("T")[0] === day.isoDate;
            return (
              <button
                key={day.isoDate}
                onClick={() => setSelectedDate(day.isoDate)}
                className={`flex-1 md:flex-initial flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer w-14 md:w-16 ${
                  isSelected
                    ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md scale-105"
                    : "bg-gray-900/40 hover:bg-gray-850 border border-gray-800/80"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? "text-purple-100" : "text-gray-500"
                  }`}
                >
                  {day.label}
                </span>
                <span className="text-lg font-black font-numeric mt-1 leading-none">
                  {day.dayNum}
                </span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Task List / Content View */}
      {loading ? (
        <Loader variant="list" count={4} />
      ) : !plan ? (
        <EmptyState
          icon="📅"
          title="No study plan for this date"
          description="Gemini study planners can structure a custom task list to keep your routine consistent."
          actionText={
            selectedDate === new Date().toISOString().split("T")[0]
              ? "Generate Today's Plan"
              : undefined
          }
          onActionClick={handleGeneratePlan}
          className="py-12"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Progress Overview */}
          <Card hoverable={false} className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Daily Completion Rate
            </h3>
            <ProgressBar value={completedCount} max={totalCount} />
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Checked off {completedCount} out of {totalCount} items. Excellent progress!
            </p>
          </Card>

          {/* Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 select-none px-1">
              Agenda Checklist
            </h4>
            <div className="space-y-3">
              <AnimatePresence>
                {plan.tasks.map((task) => (
                  <motion.label
                    layout
                    key={task._id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      task.completed
                        ? "bg-purple-950/10 border-purple-900/40"
                        : "glass-panel border-gray-800/80 hover:border-purple-500/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task._id)}
                      className="mt-1 w-5 h-5 rounded text-purple-600 border-gray-700 bg-gray-900 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <div className="flex-1 select-none">
                      <span
                        className={`text-base font-semibold leading-tight block ${
                          task.completed
                            ? "line-through text-gray-600"
                            : "text-gray-200"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </motion.label>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default StuddyPlanner;
