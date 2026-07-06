const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createPlan,
  getTodayPlan,
  toggleTask,
  explainTopic,
} =
require("../controllers/plannerControllers");

router.post(
  "/generate",
  authMiddleware,
  createPlan
);

router.post(
  "/explain",
  authMiddleware,
  explainTopic
);

router.get(
  "/today",
  authMiddleware,
  getTodayPlan
);

router.put(
  "/:planId/:taskId",
  authMiddleware,
  toggleTask
);

module.exports = router;