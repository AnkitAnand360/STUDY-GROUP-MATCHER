const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  findMatches,
} = require("../controllers/matchController");

router.get("/", authMiddleware, findMatches);

module.exports = router;