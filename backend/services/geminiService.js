const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateMatchExplanation(currentUser, matchedUser, score) {
  const curSkills = Array.isArray(currentUser?.skills) && currentUser.skills.length > 0
    ? currentUser.skills.join(", ")
    : "Web Development, Computer Science";
  const curSubj = Array.isArray(currentUser?.subjects) && currentUser.subjects.length > 0
    ? currentUser.subjects.join(", ")
    : "Computer Science";
  const matSkills = Array.isArray(matchedUser?.skills) && matchedUser.skills.length > 0
    ? matchedUser.skills.join(", ")
    : "Web Development, Computer Science";
  const matSubj = Array.isArray(matchedUser?.subjects) && matchedUser.subjects.length > 0
    ? matchedUser.subjects.join(", ")
    : "Computer Science";

  const prompt = `
You are an AI study assistant.

Current Student:
Name: ${currentUser?.name || "Student"}
Skills: ${curSkills}
Subjects: ${curSubj}
Goal: ${currentUser?.studyGoal || "Collaborative learning"}

Matched Student:
Name: ${matchedUser?.name || "Peer"}
Skills: ${matSkills}
Subjects: ${matSubj}
Goal: ${matchedUser?.studyGoal || "Collaborative learning"}

Compatibility Score: ${score}/100

Explain in 3-4 sentences:
- Why they are a good study match
- What they can learn from each other
- Keep it encouraging and concise.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    return `High synergy study match (${score}% compatibility)! You both share strong academic focus in ${curSkills.split(",")[0]} and ${matSkills.split(",")[0]}, making you ideal partners for collaborative problem solving.`;
  }
}

async function generateStudyPlan(user) {
  const skillsList = Array.isArray(user?.skills) && user.skills.length > 0
    ? user.skills.join(", ")
    : "Data Structures & Algorithms, React, Node.js, Web Development";
  const subjectsList = Array.isArray(user?.subjects) && user.subjects.length > 0
    ? user.subjects.join(", ")
    : "Computer Science, Software Engineering";
  const goalStr = user?.studyGoal || "Master core algorithms and build production web applications";

  const prompt = `
Create a realistic one-day study plan for a university student.

Student Skills:
${skillsList}

Subjects:
${subjectsList}

Goal:
${goalStr}

Return ONLY a valid JSON array of 4-5 tasks, with no markdown code fences and no extra text, in this exact format:
[
  { "title": "Review Graph BFS/DFS Algorithms and practice traversal", "duration": "45 mins" },
  { "title": "Build modular React UI components with custom hooks", "duration": "60 mins" },
  { "title": "Solve 3 medium algorithmic problems on LeetCode", "duration": "45 mins" },
  { "title": "Synthesize summary notes and review study group questions", "duration": "30 mins" }
]
`;

  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini Timeout")), 4500)),
    ]);

    return response.text;
  } catch (err) {
    console.warn("Gemini Study Plan AI fallback used:", err.message);
    const primarySkill = skillsList.split(",")[0].trim() || "Full-Stack Concepts";
    const primarySubj = subjectsList.split(",")[0].trim() || "Data Structures";
    return JSON.stringify([
      { title: `Deep dive into ${primarySkill} fundamentals & documentation`, duration: "45 mins" },
      { title: `Solve 3 practice coding problems on ${primarySubj}`, duration: "60 mins" },
      { title: `Collaborate with study room peers on system design & code review`, duration: "45 mins" },
      { title: `Review mistakes and write quick synthesis notes for today`, duration: "30 mins" },
    ]);
  }
}

module.exports = {
  generateMatchExplanation,
  generateStudyPlan,
};
