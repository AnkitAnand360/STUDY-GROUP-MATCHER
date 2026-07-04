import { useEffect, useState } from "react";
import axios from "axios";

import { days } from "../data/days";
import { timeSlots } from "../data/timeSlots";

function Profile() {
  const [skills, setSkills] = useState("");

  const [subjects, setSubjects] =
    useState("");

  const [studyGoal, setStudyGoal] =
    useState("");

  const [selectedDays, setSelectedDays] =
    useState([]);

  const [selectedTimes, setSelectedTimes] =
    useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const user = response.data;

      setSkills(user.skills.join(", "));
      setSubjects(
        user.subjects.join(", ")
      );

      setStudyGoal(user.studyGoal);

      setSelectedDays(
        user.availability.days
      );

      setSelectedTimes(
        user.availability.timeSlots
      );

    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/profile",
        {
          skills: skills
            .split(",")
            .map((item) => item.trim()),

          subjects: subjects
            .split(",")
            .map((item) => item.trim()),

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

      alert("Profile Updated");

    } catch (error) {
      console.log(error);
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter(
          (d) => d !== day
        )
      );
    } else {
      setSelectedDays([
        ...selectedDays,
        day,
      ]);
    }
  };

  const toggleTime = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(
        selectedTimes.filter(
          (t) => t !== time
        )
      );
    } else {
      setSelectedTimes([
        ...selectedTimes,
        time,
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5">

      <h1 className="text-4xl font-bold mb-8">
        My Study Profile
      </h1>

      <input
        className="border p-3 w-full mb-4 rounded"
        placeholder="Skills"
        value={skills}
        onChange={(e) =>
          setSkills(e.target.value)
        }
      />

      <input
        className="border p-3 w-full mb-4 rounded"
        placeholder="Subjects"
        value={subjects}
        onChange={(e) =>
          setSubjects(e.target.value)
        }
      />

      <input
        className="border p-3 w-full mb-6 rounded"
        placeholder="Study Goal"
        value={studyGoal}
        onChange={(e) =>
          setStudyGoal(e.target.value)
        }
      />

      <h2 className="text-2xl mb-4">
        Available Days
      </h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {days.map((day) => (
          <button
            key={day}
            onClick={() =>
              toggleDay(day)
            }
            className={`px-4 py-2 rounded ${
              selectedDays.includes(day)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <h2 className="text-2xl mb-4">
        Time Slots
      </h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() =>
              toggleTime(time)
            }
            className={`px-4 py-2 rounded ${
              selectedTimes.includes(time)
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <button
        onClick={saveProfile}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Save Profile
      </button>

    </div>
  );
}

export default Profile;