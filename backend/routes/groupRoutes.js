const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createGroup,
  joinGroup,
  getGroups,
  getAllGroups,
  deleteGroup,
  inviteMember,
  removeMember,
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

router.delete(
  "/:id",
  authMiddleware,
  deleteGroup
);

router.post(
  "/:id/invite",
  authMiddleware,
  inviteMember
);

router.delete(
  "/:id/members/:userId",
  authMiddleware,
  removeMember
);

module.exports = router;
