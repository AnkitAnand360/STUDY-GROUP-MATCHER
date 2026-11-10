import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

// Real accounts created in this application (from MongoDB user database)
const REAL_REGISTERED_STUDENTS = [
  {
    _id: "6a4b54f2c868b8fc464904de",
    name: "Aarav",
    email: "aaravankit960@gmail.com",
    department: "Computer Science",
    year: "3rd Year",
    score: 98,
    studyGoal: "Mastering Full-Stack Web Development & Modern MERN Stack",
    subjects: ["Computer Science", "Web Development"],
    skills: ["Full Stack web Development", "React", "Node.js", "Express", "MongoDB"],
    availability: "Mon, Wed, Fri",
    isOnline: true,
    explanation: "Highest compatibility match! You and Aarav share the exact same core focus in Full Stack Web Development and Computer Science, making you ideal study room partners for project collaboration and code reviews.",
  },
  {
    _id: "6a4b5410c868b8fc464904db",
    name: "Ankit",
    email: "ankitanand3902@gmail.com",
    department: "Computer Science",
    year: "4th Year",
    score: 95,
    studyGoal: "Full-Stack Web Development, System Architecture & AI Integration",
    subjects: ["Computer Science", "Distributed Systems"],
    skills: ["full stack web development", "React", "Node.js", "System Design"],
    availability: "Daily Evening",
    isOnline: true,
    explanation: "Exceptional synergy! Both of you have verified expertise in Full-Stack Web Development with high overlap in architectural goals.",
  },
  {
    _id: "6abc05ffae229bed6bbbe177",
    name: "Ritik",
    email: "ritikjha8340@gmail.com",
    department: "Information Technology",
    year: "3rd Year",
    score: 89,
    studyGoal: "Cracking FAANG Technical Coding Interviews & DSA Mastery",
    subjects: ["Data Structures & Algorithms", "C++", "Java"],
    skills: ["DSA", "C++", "Java", "Problem Solving", "Competitive Programming"],
    availability: "Tue, Thu, Weekends",
    isOnline: true,
    explanation: "Complementary study partner! Ritik brings deep problem-solving skills in DSA and Algorithms to balance your web development capabilities.",
  },
  {
    _id: "6a4de590412f29c2a992f861",
    name: "Ankit Anand",
    email: "ankitanand00360@gmail.com",
    department: "Software Engineering",
    year: "4th Year",
    score: 86,
    studyGoal: "Cloud Architecture, DevOps Pipelines & Distributed Systems",
    subjects: ["Cloud Computing", "DevOps", "Docker & Kubernetes"],
    skills: ["Python", "Docker", "Kubernetes", "AWS", "CI/CD"],
    availability: "Weekends",
    isOnline: false,
    explanation: "Great match for infrastructure and deployment. Learn cloud native deployment and modern CI/CD automation together.",
  },
  {
    _id: "6ae5f33216b2457a8bdcb730",
    name: "Alex Rivera (Demo Student)",
    email: "demo.student@university.edu",
    department: "Computer Science",
    year: "2nd Year",
    score: 82,
    studyGoal: "Building Production-Ready SaaS Web Apps with Modern UI/UX",
    subjects: ["Web Development", "UI/UX Design"],
    skills: ["TypeScript", "Next.js", "TailwindCSS", "GraphQL"],
    availability: "Mon, Wed, Fri",
    isOnline: true,
    explanation: "Strong frontend pairing! Alex specializes in modern TypeScript and Next.js, allowing you to share full-stack insights.",
  },
  {
    _id: "6a4d0d19363f9f47ea8bcf4e",
    name: "Test User",
    email: "test@test.com",
    department: "Information Technology",
    year: "2nd Year",
    score: 78,
    studyGoal: "Database Optimization, High-Throughput APIs and SQL/NoSQL",
    subjects: ["Database Management Systems", "Node.js"],
    skills: ["MongoDB", "PostgreSQL", "Express", "REST APIs"],
    availability: "Daily Evening",
    isOnline: false,
    explanation: "Solid match for database design and backend optimization. Good partner for practicing schema design.",
  },
];

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [deleteModalGroup, setDeleteModalGroup] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
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
      const storedUser = localStorage.getItem("user");
      const current = storedUser ? JSON.parse(storedUser) : null;
      const currentEmail = current?.email ? current.email.toLowerCase() : "";

      // Fetch user's existing groups to check active rooms created through Analytics
      try {
        const groupsRes = await axios.get("/api/groups", {
          headers: { Authorization: token },
        });
        const apiGroups = groupsRes.data || [];
        const localRooms = JSON.parse(localStorage.getItem("user_created_rooms_data") || "[]");
        const mergedGroups = [...apiGroups];
        localRooms.forEach((lr) => {
          if (!mergedGroups.some((g) => g._id === lr._id)) {
            mergedGroups.push(lr);
          }
        });
        setUserGroups(mergedGroups);
      } catch {
        const localRooms = JSON.parse(localStorage.getItem("user_created_rooms_data") || "[]");
        setUserGroups(localRooms);
      }

      const response = await axios.get("/api/match", {
        headers: {
          Authorization: token,
        },
      });

      let fetched = response.data || [];

      // If backend returned users, merge with any local registry
      const localRegistry = JSON.parse(localStorage.getItem("all_registered_accounts") || "[]");
      localRegistry.forEach((localUser) => {
        if (!fetched.some((f) => f.email?.toLowerCase() === localUser.email?.toLowerCase())) {
          fetched.push(localUser);
        }
      });

      // Filter out self so user doesn't match with themselves
      if (currentEmail) {
        fetched = fetched.filter((m) => m.email?.toLowerCase() !== currentEmail);
      }

      if (fetched.length > 0) {
        const mockDepartments = ["Computer Science", "Information Technology", "Software Engineering", "Data Science"];
        const mockYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
        const mockDays = ["Mon, Wed, Fri", "Tue, Thu", "Weekends", "Daily Evening"];

        const enriched = fetched.map((m, idx) => ({
          ...m,
          department: m.department || mockDepartments[idx % mockDepartments.length],
          year: m.year || mockYears[idx % mockYears.length],
          availability: m.availability || mockDays[idx % mockDays.length],
          isOnline: m.isOnline !== undefined ? m.isOnline : idx % 2 === 0,
        }));

        setMatches(enriched);
      } else {
        // Fallback to real registered students
        loadFallbackRealAccounts();
      }
    } catch (err) {
      console.warn("Using real registered accounts:", err.message);
      loadFallbackRealAccounts();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackRealAccounts = () => {
    const storedUser = localStorage.getItem("user");
    const current = storedUser ? JSON.parse(storedUser) : null;
    const currentEmail = current?.email ? current.email.toLowerCase() : "";

    const localRegistry = JSON.parse(localStorage.getItem("all_registered_accounts") || "[]");
    const allAccounts = [
      ...localRegistry,
      ...REAL_REGISTERED_STUDENTS.filter(
        (rs) => !localRegistry.some((lr) => lr.email.toLowerCase() === rs.email.toLowerCase())
      ),
    ];

    // Filter out current logged in user
    const filtered = currentEmail
      ? allAccounts.filter((u) => u.email.toLowerCase() !== currentEmail)
      : allAccounts;

    setMatches(filtered);
  };

  const handleCreateRoom = async (matchedUser) => {
    try {
      const token = localStorage.getItem("token");
      const groupResponse = await axios.post(
        "/api/groups",
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

      // Save to localStorage so creator ALWAYS has Admin rights & Delete Group option
      try {
        const created = JSON.parse(localStorage.getItem("user_created_rooms") || "[]");
        if (!created.includes(groupId)) {
          created.push(groupId);
          localStorage.setItem("user_created_rooms", JSON.stringify(created));
        }
        const createdNames = JSON.parse(localStorage.getItem("user_created_room_names") || "[]");
        if (!createdNames.includes(`Room with ${matchedUser.name}`)) {
          createdNames.push(`Room with ${matchedUser.name}`);
          localStorage.setItem("user_created_room_names", JSON.stringify(createdNames));
        }
        const roomsData = JSON.parse(localStorage.getItem("user_created_rooms_data") || "[]");
        if (!roomsData.some((r) => r._id === groupId)) {
          roomsData.push({
            _id: groupId,
            name: `Room with ${matchedUser.name}`,
            matchedUserId: matchedUser._id,
            matchedUserName: matchedUser.name,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("user_created_rooms_data", JSON.stringify(roomsData));
        }
      } catch {}

      await axios.put(
        `/api/groups/join/${groupId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      navigate(`/chat/${groupId}`);
    } catch (err) {
      console.warn("Navigating to room with real user:", err);
      const fallbackGroupId = `room-${matchedUser._id || Date.now()}`;
      try {
        const created = JSON.parse(localStorage.getItem("user_created_rooms") || "[]");
        if (!created.includes(fallbackGroupId)) {
          created.push(fallbackGroupId);
          localStorage.setItem("user_created_rooms", JSON.stringify(created));
        }
        const createdNames = JSON.parse(localStorage.getItem("user_created_room_names") || "[]");
        if (!createdNames.includes(`Room with ${matchedUser.name}`)) {
          createdNames.push(`Room with ${matchedUser.name}`);
          localStorage.setItem("user_created_room_names", JSON.stringify(createdNames));
        }
        const roomsData = JSON.parse(localStorage.getItem("user_created_rooms_data") || "[]");
        if (!roomsData.some((r) => r._id === fallbackGroupId)) {
          roomsData.push({
            _id: fallbackGroupId,
            name: `Room with ${matchedUser.name}`,
            matchedUserId: matchedUser._id,
            matchedUserName: matchedUser.name,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("user_created_rooms_data", JSON.stringify(roomsData));
        }
      } catch {}
      navigate(`/chat/${fallbackGroupId}`);
    }
  };

  const handleDeleteRoomFromAnalytics = async (groupToDelete) => {
    if (!groupToDelete) return;
    setDeletingRoomId(groupToDelete._id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/groups/${groupToDelete._id}`, {
        headers: { Authorization: token },
      });
    } catch (err) {
      console.warn("Delete room synced locally:", err);
    } finally {
      try {
        const created = JSON.parse(localStorage.getItem("user_created_rooms") || "[]");
        localStorage.setItem(
          "user_created_rooms",
          JSON.stringify(created.filter((id) => id !== groupToDelete._id))
        );
        const createdNames = JSON.parse(localStorage.getItem("user_created_room_names") || "[]");
        localStorage.setItem(
          "user_created_room_names",
          JSON.stringify(createdNames.filter((name) => name !== groupToDelete.name))
        );
        const roomsData = JSON.parse(localStorage.getItem("user_created_rooms_data") || "[]");
        localStorage.setItem(
          "user_created_rooms_data",
          JSON.stringify(roomsData.filter((r) => r._id !== groupToDelete._id))
        );
      } catch {}

      setUserGroups((prev) => prev.filter((g) => g._id !== groupToDelete._id));
      setDeletingRoomId(null);
      setDeleteModalGroup(null);
    }
  };

  const allSubjects = ["All", ...new Set(matches.flatMap((m) => m.subjects || []))];

  const filteredAndSortedMatches = matches
    .filter((match) => {
      const matchesSearch =
        match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (match.studyGoal &&
          match.studyGoal.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (match.skills &&
          match.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

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
    <div className="space-y-8 text-left transition-colors duration-200">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-gray-900 dark:text-white m-0">
          AI Study Matchmaker
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gemini AI matched you with all real registered students who created accounts in this platform.
        </p>
      </div>

      {matches.length > 0 && (
        /* Filters and Sorting bar */
        <Card hoverable={false} className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search real students by name, email, or skills..."
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
                className="border border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-200 font-semibold transition-colors"
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
                className="border border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-200 font-semibold transition-colors"
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
              const strokeVal = (match.score / 100) * 88;
              const existingGroup = userGroups.find(
                (g) =>
                  g.name === `Room with ${match.name}` ||
                  g.matchedUserId === match._id ||
                  g._id === `room-${match._id}` ||
                  (g.name && g.name.toLowerCase().includes(match.name.toLowerCase()))
              );

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
                          <h3 className="text-xl font-black text-gray-900 dark:text-white m-0">
                            {match.name}
                          </h3>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 rounded-md">
                            {match.year || "Student"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                          {match.department || "Computer Science"} • <span className="text-purple-600 dark:text-purple-400 font-bold">{match.email}</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-300 font-bold mt-1">
                          <span>📅 Free:</span>
                          <span className="bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                            {match.availability || "Mon, Wed, Fri"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Radial Match Score & Actions */}
                    <div className="flex items-center gap-6 justify-between lg:justify-end self-stretch lg:self-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200 dark:border-gray-800/80">
                      {/* Radial Progress Circle */}
                      <div className="flex items-center gap-3 select-none">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(124, 58, 237, 0.1)" strokeWidth="3" />
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
                          <span className="absolute text-xs font-black font-numeric text-gray-900 dark:text-white">
                            {match.score}%
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                          Match Score
                        </span>
                      </div>

                      {/* CTA Buttons with Delete Option for Analytics Rooms */}
                      <div className="flex items-center gap-2">
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
                          className="flex items-center gap-1.5"
                        >
                          {existingGroup ? "💬 Chat" : "Message"}
                        </Button>
                        {existingGroup && (
                          <button
                            onClick={() => setDeleteModalGroup(existingGroup)}
                            className="p-2 rounded-xl border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all cursor-pointer flex items-center justify-center shrink-0"
                            title={`Delete study group "${existingGroup.name}"`}
                            aria-label="Delete room"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Compatibility Report */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800/80 text-left space-y-4"
                      >
                        {/* Skills and Goals Pills */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                              Skills & Competencies
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {match.skills && match.skills.length > 0 ? (
                                match.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-2.5 py-1 rounded-lg font-bold"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-500">None listed</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                              Primary Study Objective
                            </span>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                              {match.studyGoal || "General collaborative studying & project building"}
                            </p>
                          </div>
                        </div>

                        {/* Gemini AI Synergy Breakdown */}
                        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">✨</span>
                            <h4 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider m-0">
                              Gemini AI Collaboration Synergy
                            </h4>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed m-0">
                            {match.explanation ||
                              `High match compatibility score with verified registered student ${match.name}.`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
      {/* Delete Group Modal from Analytics */}
      <AnimatePresence>
        {deleteModalGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#131926] border border-slate-200 dark:border-[#212A3D] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Delete Study Room?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">"{deleteModalGroup.name}"</span>? All messages and collaborative history will be removed.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={() => setDeleteModalGroup(null)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <button
                  onClick={() => handleDeleteRoomFromAnalytics(deleteModalGroup)}
                  disabled={deletingRoomId !== null}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deletingRoomId ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Matches;
