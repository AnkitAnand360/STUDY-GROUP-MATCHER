const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateMatchExplanation(currentUser, matchedUser, score) {
  const prompt = `
You are an AI study assistant.

Current Student:
Name: ${currentUser.name}
Skills: ${currentUser.skills.join(", ")}
Subjects: ${currentUser.subjects.join(", ")}
Goal: ${currentUser.studyGoal}

Matched Student:
Name: ${matchedUser.name}
Skills: ${matchedUser.skills.join(", ")}
Subjects: ${matchedUser.subjects.join(", ")}
Goal: ${matchedUser.studyGoal}

Compatibility Score: ${score}/100

Explain in 3-4 sentences:
- Why they are a good study match
- What they can learn from each other
- Keep it encouraging and concise.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

async function generateStudyPlan(user) {

  const prompt = `
Create a one-day study plan.

Student Skills:
${user.skills.join(", ")}

Subjects:
${user.subjects.join(", ")}

Goal:
${user.studyGoal}

Return ONLY a JSON array like:

[
 { "title":"Complete React Hooks" },
 { "title":"Solve 5 DSA Problems" }
]
`;

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

  return response.text;
}

module.exports = {
  generateMatchExplanation,
  generateStudyPlan,
};