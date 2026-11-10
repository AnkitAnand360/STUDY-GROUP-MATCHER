const User = require("../models/User");
const {
  generateMatchExplanation,
} = require("../services/geminiService");

exports.findMatches = async (req, res) => {
  try {
    // 1. Identify Current User by ID or Email
    let currentUser = null;
    if (req.user?.id) {
      currentUser = await User.findById(req.user.id).catch(() => null);
    }
    if (!currentUser && req.user?.email) {
      currentUser = await User.findOne({ email: req.user.email.toLowerCase() }).catch(() => null);
    }

    // Default current user fallback if in demo/guest session
    if (!currentUser) {
      currentUser = {
        _id: "6a4b5410c868b8fc464904db",
        name: req.user?.name || "Ankit",
        email: req.user?.email || "ankitanand3902@gmail.com",
        skills: ["full stack web development", "React", "Node.js"],
        subjects: ["Computer Science", "Web Development"],
        studyGoal: "Master Full-Stack Web Development & System Design",
        availability: {
          days: ["Mon, Wed, Fri"],
          timeSlots: ["Evening"],
        },
      };
    }

    // 2. Find ALL other registered real accounts in the database
    const currentEmail = currentUser.email ? currentUser.email.toLowerCase() : "";
    const users = await User.find({
      email: { $ne: currentEmail },
    }).lean();

    // 3. Compute match compatibility for all real accounts
    const matches = await Promise.all(
      users.map(async (otherUser) => {
        const score = calculateScore(currentUser, otherUser);

        // Safely generate explanation without crashing on timeout
        let explanation = "";
        try {
          if (score >= 80 && otherUser.skills?.length > 0) {
            explanation = await Promise.race([
              generateMatchExplanation(currentUser, otherUser, score),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1800)),
            ]);
          }
        } catch (e) {
          // Handled gracefully below
        }

        if (!explanation) {
          const common = (currentUser.skills || []).filter((s) =>
            (otherUser.skills || []).some((os) => os.toLowerCase() === s.toLowerCase())
          );
          if (common.length > 0) {
            explanation = `High synergy study match! You both share strong skills in ${common.join(", ")} and Computer Science.`;
          } else {
            explanation = `Great potential study partner with complementary skills in academic project collaboration.`;
          }
        }

        const mockDepartments = ["Computer Science", "Information Technology", "Software Engineering", "Data Science"];
        const mockYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
        const mockDays = ["Mon, Wed, Fri", "Tue, Thu", "Weekends", "Daily Evening"];
        const hash = otherUser.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

        return {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          skills: otherUser.skills && otherUser.skills.length > 0 ? otherUser.skills : ["Full Stack Web Development", "Computer Science"],
          subjects: otherUser.subjects && otherUser.subjects.length > 0 ? otherUser.subjects : ["Computer Science"],
          studyGoal: otherUser.studyGoal || "Collaborative group study & interview prep",
          department: mockDepartments[hash % mockDepartments.length],
          year: mockYears[hash % mockYears.length],
          availability: mockDays[hash % mockDays.length],
          isOnline: hash % 2 === 0,
          score,
          explanation,
          createdAt: otherUser.createdAt,
        };
      })
    );

    // Sort by highest match score
    matches.sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    console.error("findMatches error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Also export an endpoint to get all registered users
exports.getAllRegisteredUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email skills subjects studyGoal createdAt").lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateScore(user, otherUser) {
  let score = 65; // Base compatibility

  const userSkills = (user?.skills || []).map((s) => s.toLowerCase());
  const otherSkills = (otherUser?.skills || []).map((s) => s.toLowerCase());

  const commonSkills = userSkills.filter((s) => otherSkills.includes(s));
  score += commonSkills.length * 15;

  const userSubjects = (user?.subjects || []).map((s) => s.toLowerCase());
  const otherSubjects = (otherUser?.subjects || []).map((s) => s.toLowerCase());

  const commonSubjects = userSubjects.filter((s) => otherSubjects.includes(s));
  score += commonSubjects.length * 10;

  if (
    user?.studyGoal &&
    otherUser?.studyGoal &&
    user.studyGoal.toLowerCase() === otherUser.studyGoal.toLowerCase()
  ) {
    score += 10;
  }

  // Common days
  const userDays = user?.availability?.days || [];
  const otherDays = otherUser?.availability?.days || [];
  if (userDays.some((d) => otherDays.includes(d))) {
    score += 5;
  }

  return Math.min(Math.max(score, 68), 98);
}
