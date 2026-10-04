import { useEffect, useState } from "react";
import axios from "axios";

import { days } from "../data/day";
import { timeSlots } from "../data/timeSlots";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Profile() {
  const [skills, setSkills] = useState("");
  const [subjects, setSubjects] = useState("");
  const [studyGoal, setStudyGoal] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: token,
        },
      });

      const user = response.data;
      setSkills(Array.isArray(user.skills) ? user.skills.join(", ") : "");
      setSubjects(Array.isArray(user.subjects) ? user.subjects.join(", ") : "");
      setStudyGoal(user.studyGoal || "");
      setSelectedDays(user.availability?.days || []);
      setSelectedTimes(user.availability?.timeSlots || []);
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfile = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/profile",
        {
          skills: skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          subjects: subjects
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          studyGoal,
          availability: {
            days: selectedDays,
            timeSlots: selectedTimes,
          },
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleTime = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left py-4">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
          <span>⚙️</span> Settings & Preferences
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          My Study Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Customize your learning goals, academic domains, and weekly availability for ideal group matching.
        </p>
      </div>

      <Card className="space-y-6">
        <form onSubmit={saveProfile} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>🎯</span> Academic Focus & Goals
            </h3>

            <Input
              label="Skills"
              placeholder="e.g. React, Python, Data Structures, Algorithms"
              helperText="Comma separated values representing your current skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <Input
              label="Subjects / Topics"
              placeholder="e.g. Distributed Systems, Machine Learning, Calculus III"
              helperText="Subjects you are currently studying or preparing for"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
            />

            <Input
              label="Study Goal"
              placeholder="e.g. Crack FAANG coding interviews or Score A+ in finals"
              helperText="Your primary objective for group studying"
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800/80 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>📅</span> Available Days
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Select the days of the week when you are open for study sessions
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {days.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 border border-purple-500"
                        : "bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700/60"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800/80 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>⏰</span> Time Slots
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Select your preferred timeslots for collaborative study calls
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {timeSlots.map((time) => {
                const isSelected = selectedTimes.includes(time);
                return (
                  <button
                    type="button"
                    key={time}
                    onClick={() => toggleTime(time)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-500"
                        : "bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700/60"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800/80 flex items-center gap-4">
            <Button type="submit" loading={loading} size="lg">
              Save Profile
            </Button>
            {saveSuccess && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                <span>✓</span> Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Profile;