import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [sortBy, setSortBy] = useState("highest"); // highest, availability

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/match", {
        headers: {
          Authorization: token,
        },
      });
      // Attach mock department, year, online status, and availability
      const mockDepartments = ["Computer Science", "Information Technology", "Software Engineering", "Data Science"];
      const mockYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
      const mockDays = ["Mon, Wed, Fri", "Tue, Thu", "Weekends", "Daily Evening"];
      
      const enriched = response.data.map((m, idx) => ({
        ...m,
        department: mockDepartments[idx % mockDepartments.length],
        year: mockYears[idx % mockYears.length],
        availability: mockDays[idx % mockDays.length],
        isOnline: idx % 3 === 0, // Mock status
      }));
      setMatches(enriched);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch matches. Make sure your profile details are set up!");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (matchedUser) => {
    try {
      const token = localStorage.getItem("token");
      const groupResponse = await axios.post(
        "http://localhost:5000/api/groups",
        {
          name: `Room with ${matchedUser.name}`,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const groupId = groupResponse.data._id;
      
      await axios.put(
        `http://localhost:5000/api/groups/join/${groupId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      navigate(`/chat/${groupId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create study room.");
    }
  };

  const allSubjects = ["All", ...new Set(matches.flatMap((m) => m.subjects || []))];

  const filteredAndSortedMatches = matches
    .filter((match) => {
      const matchesSearch =
        match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (match.studyGoal &&
          match.studyGoal.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject =
        selectedSubject === "All" ||
        (match.subjects && match.subjects.includes(selectedSubject));

      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === "highest") {
        return b.score - a.score;
      }
      if (sortBy === "availability") {
        return (b.skills?.length || 0) - (a.skills?.length || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-gray-900/60 animate-pulse rounded-2xl w-full"></div>
        <Loader variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-white m-0">
          AI Study Matchmaker
        </h1>
        <p className="text-gray-400 mt-1">
          Gemini AI matched you with these study partners based on your profile skills, subjects, and compatibility.
        </p>
      </div>

      {error && (
        <div className="bg-red-950 text-red-300 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {matches.length > 0 && (
        /* Filters and Sorting bar */
        <Card hoverable={false} className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by name or goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />

          <div className="flex gap-4 w-full md:w-auto">
            {/* Subject filter dropdown */}
            <div className="flex-1 md:flex-initial flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase select-none">
                Filter Subject
              </span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-800 bg-gray-900 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-205 font-semibold transition-colors"
              >
                {allSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort options dropdown */}
            <div className="flex-1 md:flex-initial flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase select-none">
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-800 bg-gray-900 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-205 font-semibold transition-colors"
              >
                <option value="highest">Highest Match</option>
                <option value="availability">Key Competency</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {filteredAndSortedMatches.length === 0 ? (
        <EmptyState
          icon={matches.length === 0 ? "👥" : "🔍"}
          title={matches.length === 0 ? "No study partners yet" : "No matches found"}
          description={
            matches.length === 0
              ? "Complete your profile setup to let Gemini match you with students."
              : "Try adjusting your search query or subject filters to locate peers."
          }
          actionText={matches.length === 0 ? "Update Profile" : undefined}
          onActionClick={matches.length === 0 ? () => navigate("/profile") : undefined}
        />
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {filteredAndSortedMatches.map((match) => {
              const isSelected = selectedMatchId === match._id;
              // Calculate stroke dasharray for match radial
              const strokeVal = (match.score / 100) * 88;
              return (
                <Card
                  key={match._id}
                  hoverable={true}
                  glowColor={match.score > 90 ? "cyan" : "purple"}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Avatar & Main Profile info */}
                    <div className="flex items-start gap-4">
                      {/* Avatar with Online indicator */}
                      <div className="relative select-none flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black uppercase shadow-md">
                          {match.name.charAt(0)}
                        </div>
                        {match.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse"></span>
                        )}
                      </div>

                      {/* Profile details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white m-0">
                            {match.name}
                          </h3>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-900/80 border border-gray-800 text-gray-400 rounded-md">
                            {match.year}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-500">
                          {match.department} • {match.email}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold mt-1">
                          <span>📅 Free:</span>
                          <span className="bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                            {match.availability}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Radial Match Score & Actions */}
                    <div className="flex items-center gap-6 justify-between lg:justify-end self-stretch lg:self-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-800/80">
                      {/* Radial Progress Circle */}
                      <div className="flex items-center gap-3 select-none">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3" />
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              fill="none"
                              stroke={match.score > 90 ? "#06B6D4" : "#7C3AED"}
                              strokeWidth="3.5"
                              strokeDasharray={`${strokeVal} 88`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-xs font-black font-numeric text-white">
                            {match.score}%
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                          Match Score
                        </span>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            setSelectedMatchId(isSelected ? null : match._id)
                          }
                          variant="outline"
                          size="sm"
                        >
                          {isSelected ? "Hide Plan" : "Compatibility"}
                        </Button>
                        <Button
                          onClick={() => handleCreateRoom(match)}
                          variant="primary"
                          size="sm"
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Compatibility Report */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-6 pt-6 border-t border-gray-800/80 text-sm space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 mb-2">
                            Key Skills & Topics
                          </h4>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {match.skills.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md text-xs font-bold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {match.subjects.map((sub, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md text-xs font-bold"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 mb-2">
                            Study Target Goal
                          </h4>
                          <p className="text-gray-400 italic font-medium">
                            "{match.studyGoal || "No goals defined yet."}"
                          </p>
                        </div>
                      </div>

                      {match.explanation && (
                        <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-cyan-500/10 border-l-4 border-cyan-400 p-4 rounded-r-xl">
                          <h4 className="font-black text-cyan-300 text-xs mb-1.5 uppercase tracking-wider">
                            Gemini Match Report Summary
                          </h4>
                          <p className="text-gray-200 leading-relaxed font-medium">
                            {match.explanation}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </Card>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default Matches;
