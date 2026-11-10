const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  findMatches,
  getAllRegisteredUsers,
} = require("../controllers/matchController");

router.get("/", authMiddleware, findMatches);
router.get("/users", authMiddleware, getAllRegisteredUsers);

module.exports = router;
