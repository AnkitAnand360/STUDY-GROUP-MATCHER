const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPlan,
  getTodayPlan,
  toggleTask,
  addTask,
  deleteTask,
  explainTopic,
} = require("../controllers/plannerControllers");

router.post("/generate", authMiddleware, createPlan);
router.post("/explain", authMiddleware, explainTopic);
router.get("/today", authMiddleware, getTodayPlan);
router.put("/:planId/:taskId", authMiddleware, toggleTask);
router.post("/:planId/tasks", authMiddleware, addTask);
router.delete("/:planId/tasks/:taskId", authMiddleware, deleteTask);

module.exports = router;
