const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

router.post(
  "/",
  authMiddleware,
  sendMessage
);

router.get(
  "/:groupId",
  authMiddleware,
  getMessages
);

router.delete(
  "/:id",
  authMiddleware,
  deleteMessage
);

module.exports = router;
