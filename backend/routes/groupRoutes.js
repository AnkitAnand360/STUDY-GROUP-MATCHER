const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createGroup,
  joinGroup,
  getGroups,
  getAllGroups,
} = require("../controllers/groupController");

router.get(
  "/",
  authMiddleware,
  getGroups
);

router.get(
  "/all",
  authMiddleware,
  getAllGroups
);

router.post(
  "/",
  authMiddleware,
  createGroup
);

router.put(
  "/join/:id",
  authMiddleware,
  joinGroup
);

module.exports = router;