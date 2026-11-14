import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import Loader from "../components/ui/Loader";
import {
  Play,
  Pause,
  RotateCcw,
  Edit2,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Check,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";

const FOCUS_PRESETS = [15, 25, 30, 45, 60];

function StuddyPlanner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Pomodoro timer states with manual editable controls
  const [focusDuration, setFocusDuration] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState("25");

  // Manual Add Task states
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("45 mins");

  // Calendar dates view
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -2; i <= 4; i++) {
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
            alert("🎉 Focus session completed! Great job. Time for a well-deserved short break!");
            setMinutes(focusDuration);
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, seconds, minutes, focusDuration]);

  // Handle setting focus timer manually
  const handleSetManualFocus = (newMins) => {
    const val = parseInt(newMins, 10);
    if (!isNaN(val) && val > 0 && val <= 300) {
      setFocusDuration(val);
      setMinutes(val);
      setSeconds(0);
      setTimerActive(false);
      setShowTimerModal(false);
    }
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setMinutes(focusDuration);
    setSeconds(0);
  };

  const fetchPlanForDate = async (dateStr) => {
    setLoading(true);
    setError("");
    try {
      // 1. Check local storage cache first
      const cached = localStorage.getItem(`study_plan_${dateStr}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.tasks) {
            setPlan(parsed);
            setLoading(false);
            return;
          }
        } catch {}
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/planner/today?date=${dateStr}`, {
        headers: {
          Authorization: token,
        },
      });

      const fetchedPlan = response.data;
      if (fetchedPlan && fetchedPlan.date === dateStr && fetchedPlan.tasks?.length > 0) {
        setPlan(fetchedPlan);
        localStorage.setItem(`study_plan_${dateStr}`, JSON.stringify(fetchedPlan));
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.warn("Planner offline / API unavailable:", err.message);
      const cached = localStorage.getItem(`study_plan_${dateStr}`);
      if (cached) {
        try {
          setPlan(JSON.parse(cached));
        } catch {
          setPlan(null);
        }
      } else {
        setPlan(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/planner/generate",
        { date: selectedDate },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data && response.data.tasks?.length > 0) {
        setPlan(response.data);
        localStorage.setItem(`study_plan_${selectedDate}`, JSON.stringify(response.data));
        setGenerating(false);
        return;
      }
      throw new Error("No tasks returned");
    } catch (err) {
      console.warn("Using smart client-side plan generator:", err.message);
      // Construct personalized tasks based on profile skills
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const skills = user?.skills?.length
        ? user.skills
        : ["Full-Stack Web Development", "Data Structures", "System Design"];
      const primarySkill = skills[0] || "Core Concepts";
      const secondarySkill = skills[1] || "Algorithms";

      const fallbackPlan = {
        _id: `plan-${Date.now()}`,
        date: selectedDate,
        tasks: [
          {
            _id: `task-${Date.now()}-1`,
            title: `Review ${primarySkill} core architecture & documentation`,
            duration: "45 mins",
            completed: false,
          },
          {
            _id: `task-${Date.now()}-2`,
            title: `Practice 3 coding challenge problems on ${secondarySkill}`,
            duration: "60 mins",
            completed: false,
          },
          {
            _id: `task-${Date.now()}-3`,
            title: "Join study room to collaborate with peers and review code",
            duration: "45 mins",
            completed: false,
          },
          {
            _id: `task-${Date.now()}-4`,
            title: "Document key learnings & prepare review checklist",
            duration: "30 mins",
            completed: false,
          },
        ],
      };

      setPlan(fallbackPlan);
      localStorage.setItem(`study_plan_${selectedDate}`, JSON.stringify(fallbackPlan));
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    if (!plan) return;

    // Optimistic instant UI update
    const updatedTasks = plan.tasks.map((t) =>
      String(t._id) === String(taskId) ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan = { ...plan, tasks: updatedTasks };
    setPlan(updatedPlan);
    localStorage.setItem(`study_plan_${selectedDate}`, JSON.stringify(updatedPlan));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/planner/${plan._id}/${taskId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (err) {
      console.warn("Task toggle sync error:", err.message);
    }
  };

  const handleCreateCustomTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !plan) return;

    const newTask = {
      _id: `task-custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      duration: newTaskDuration || "30 mins",
      completed: false,
    };

    const updatedTasks = [...plan.tasks, newTask];
    const updatedPlan = { ...plan, tasks: updatedTasks };
    setPlan(updatedPlan);
    localStorage.setItem(`study_plan_${selectedDate}`, JSON.stringify(updatedPlan));
    setNewTaskTitle("");
    setShowAddTaskForm(false);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/planner/${plan._id}/tasks`,
        { title: newTask.title, duration: newTask.duration },
        { headers: { Authorization: token } }
      );
    } catch (err) {
      console.warn("Backend add task sync:", err.message);
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    if (!plan) return;

    const updatedTasks = plan.tasks.filter((t) => String(t._id) !== String(taskId));
    const updatedPlan = { ...plan, tasks: updatedTasks };
    setPlan(updatedPlan);
    localStorage.setItem(`study_plan_${selectedDate}`, JSON.stringify(updatedPlan));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/planner/${plan._id}/tasks/${taskId}`, {
        headers: { Authorization: token },
      });
    } catch (err) {
      console.warn("Delete task sync:", err.message);
    }
  };

  const completedCount = plan?.tasks
    ? plan.tasks.filter((t) => t.completed).length
    : 0;
  const totalCount = plan?.tasks ? plan.tasks.length : 0;

  return (
    <div className="space-y-6 sm:space-y-8 text-left transition-colors duration-200 font-sans">
      {/* Top Header & Editable Pomodoro Focus Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white m-0">
            Daily AI Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Structured study schedules based on your profile topic focus areas.
          </p>
        </div>

        {/* Editable Focus Widget with Manual Time Controls */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 p-2 sm:p-2.5 rounded-2xl shadow-sm self-start sm:self-auto select-none">
          {/* Timer Display (clickable to edit) */}
          <button
            type="button"
            onClick={() => {
              setCustomMinutesInput(String(focusDuration));
              setShowTimerModal(true);
            }}
            title="Click to set focus time manually"
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-900 dark:text-white transition-colors cursor-pointer group"
          >
            <Clock className={`w-4 h-4 ${timerActive ? "text-[#8B5CF6] animate-pulse" : "text-slate-500"}`} />
            <span className="text-sm sm:text-base font-bold font-numeric tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-md">
              Focus
            </span>
            <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-[#8B5CF6] transition-colors" />
          </button>

          {/* Timer Play / Pause Button */}
          <Button
            size="sm"
            variant={timerActive ? "outline" : "primary"}
            onClick={() => setTimerActive(!timerActive)}
            className="py-1 px-3 text-xs flex items-center gap-1 cursor-pointer"
          >
            {timerActive ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Start</span>
              </>
            )}
          </Button>

          {/* Reset Timer Button */}
          {(timerActive || minutes !== focusDuration || seconds !== 0) && (
            <button
              onClick={handleResetTimer}
              title="Reset focus timer"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Calendar Schedule Horizontal Strip */}
      <Card hoverable={false} className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 select-none flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Calendar Schedule</span>
          </h4>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Selected: <span className="text-[#8B5CF6] font-bold">{selectedDate}</span>
          </span>
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
          {calendarDays.map((day) => {
            const isSelected = selectedDate === day.isoDate;
            const isToday =
              new Date().toISOString().split("T")[0] === day.isoDate;
            return (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => setSelectedDate(day.isoDate)}
                className={`flex-1 min-w-[56px] sm:min-w-[68px] flex flex-col items-center justify-center py-2.5 sm:py-3 px-2 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] text-white shadow-md shadow-purple-500/25 scale-[1.03]"
                    : "bg-slate-100 dark:bg-zinc-900/60 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {day.label}
                </span>
                <span className="text-base sm:text-lg font-black font-numeric mt-1 leading-none">
                  {day.dayNum}
                </span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Task List / Content View */}
      {loading ? (
        <Loader variant="list" count={4} />
      ) : !plan || !plan.tasks || plan.tasks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 sm:p-12 text-center bg-white dark:bg-[#0A0A0A] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-[#8B5CF6] flex items-center justify-center mx-auto text-2xl font-bold">
            📅
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white">
              No study plan for this date
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Gemini AI study planners can structure a custom task list to keep your learning routine consistent.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              disabled={generating}
              onClick={handleGeneratePlan}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "Generating AI Plan..." : "Generate Today's Plan"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const emptyPlan = {
                  _id: `plan-${Date.now()}`,
                  date: selectedDate,
                  tasks: [],
                };
                setPlan(emptyPlan);
                setShowAddTaskForm(true);
              }}
              className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Task Manually</span>
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Progress Overview Card */}
          <Card hoverable={false} className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white m-0">
                  Daily Completion Rate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Checked off {completedCount} out of {totalCount} items ({totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskForm(!showAddTaskForm)}
                  className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-[#8B5CF6] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>

                <button
                  type="button"
                  disabled={generating}
                  onClick={handleGeneratePlan}
                  title="Regenerate plan with Gemini AI"
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400 hover:text-[#8B5CF6] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <Sparkles className={`w-4 h-4 ${generating ? "animate-spin text-[#8B5CF6]" : ""}`} />
                </button>
              </div>
            </div>

            <ProgressBar value={completedCount} max={totalCount} />
          </Card>

          {/* Inline Add Task Form */}
          <AnimatePresence>
            {showAddTaskForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateCustomTask}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-purple-500/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Create Custom Study Task</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddTaskForm(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    placeholder="Enter task title (e.g. Master Binary Search Trees, Read Chapter 4)..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6]"
                  />

                  <select
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                    <option value="90 mins">90 mins</option>
                  </select>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:opacity-95 cursor-pointer whitespace-nowrap"
                  >
                    Add Task
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Agenda Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 select-none">
                Agenda Checklist
              </h4>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {plan.tasks.length} {plan.tasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            <div className="space-y-2.5">
              <AnimatePresence>
                {plan.tasks.map((task) => (
                  <motion.div
                    layout
                    key={task._id}
                    onClick={() => handleToggleTask(task._id)}
                    className={`group/task flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      task.completed
                        ? "bg-purple-500/10 border-purple-500/30"
                        : "bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-zinc-800 hover:border-[#8B5CF6]/50 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Custom Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                          task.completed
                            ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                            : "border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 group-hover/task:border-[#8B5CF6]"
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Task title & duration */}
                      <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            task.completed
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {task.title}
                        </span>

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md self-start sm:self-auto">
                          {task.duration || "45 mins"}
                        </span>
                      </div>
                    </div>

                    {/* Delete Task Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTask(task._id, e)}
                      title="Delete task"
                      className="opacity-0 group-hover/task:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* Manual Focus Timer Settings Modal */}
      <AnimatePresence>
        {showTimerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#8B5CF6] flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
                      Set Focus Duration
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
                      Configure your focus timer manually
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTimerModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Quick Presets
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {FOCUS_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setCustomMinutesInput(String(p));
                        handleSetManualFocus(p);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        focusDuration === p
                          ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-sm"
                          : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-[#8B5CF6]"
                      }`}
                    >
                      {p}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Number Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Custom Minutes (1 - 180 min)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customMinutesInput}
                    onChange={(e) => setCustomMinutesInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSetManualFocus(customMinutesInput)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold text-xs shadow-md shadow-purple-500/25 hover:opacity-95 cursor-pointer"
                  >
                    Set Focus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StuddyPlanner;
