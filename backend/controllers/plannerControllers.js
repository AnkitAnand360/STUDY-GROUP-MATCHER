const StudyPlan = require("../models/StudyPlan");
const User = require("../models/User");
const {
  generateStudyPlan,
} = require("../services/geminiService");

exports.createPlan = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const aiResponse =
      await generateStudyPlan(user);

    const cleanJson = aiResponse.replace(/```json|```/g, "").trim();

    const tasks =
      JSON.parse(cleanJson);

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const plan =
      await StudyPlan.create({
        user: user._id,
        date: today,
        tasks,
      });

    res.status(201).json(plan);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

exports.getTodayPlan = async (req, res) => {

  try {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const plan =
      await StudyPlan.findOne({
        user: req.user.id,
        date: today,
      });

    res.json(plan);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

exports.toggleTask = async (req, res) => {

  try {

    const plan =
      await StudyPlan.findById(
        req.params.planId
      );

    const task =
      plan.tasks.id(req.params.taskId);

    task.completed =
      !task.completed;

    await plan.save();

    res.json(plan);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

exports.explainTopic = async (req, res) => {
  try {
    const { topic } = req.body;
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: topic,
    });

    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};