const Message = require("../models/Message");
const Group = require("../models/Group");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  try {
    const { groupId, text } = req.body;

    let senderId = req.user?.id || req.user?._id;
    let senderName = req.user?.name;
    let senderEmail = req.user?.email;

    if (!senderName && senderId) {
      const user = await User.findById(senderId).catch(() => null);
      if (user) {
        senderName = user.name;
        senderEmail = user.email;
      }
    }

    if (!senderName) {
      senderName = "Admin";
    }

    const message = await Message.create({
      group: groupId,
      sender: senderId || "650000000000000000000001",
      text,
    });

    let populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    if (populatedMessage) {
      populatedMessage = populatedMessage.toObject();
    } else {
      populatedMessage = message.toObject();
    }

    // Guarantee that sender is never null or Unknown
    if (!populatedMessage.sender || !populatedMessage.sender.name || populatedMessage.sender.name === "Unknown") {
      populatedMessage.sender = {
        _id: senderId || "650000000000000000000001",
        name: senderName,
        email: senderEmail || "",
      };
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get chat history
exports.getMessages = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("createdBy", "name email")
      .lean()
      .catch(() => null);

    const messages = await Message.find({
      group: req.params.groupId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map((msg) => {
      if (!msg.sender || !msg.sender.name || msg.sender.name === "Unknown") {
        const adminName = group?.createdBy?.name || "Admin";
        const adminEmail = group?.createdBy?.email || "";
        const senderId = msg.sender?._id || msg.sender || group?.createdBy?._id || "650000000000000000000001";
        return {
          ...msg,
          sender: {
            _id: senderId,
            name: adminName,
            email: adminEmail,
          },
        };
      }
      return msg;
    });

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// delete message (Message Author or Group Admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const group = await Group.findById(message.group);

    const currentUserId = req.user.id ? req.user.id.toString() : "";
    const senderId = message.sender ? (message.sender._id || message.sender).toString() : "";
    const groupAdminId = group && group.createdBy ? (group.createdBy._id || group.createdBy).toString() : "";

    const isAuthor = Boolean(currentUserId && senderId && currentUserId === senderId);
    const isGroupAdmin = Boolean(currentUserId && groupAdminId && currentUserId === groupAdminId);

    if (!isAuthor && !isGroupAdmin) {
      return res.status(403).json({
        message: "Permission denied. Only the group admin or message author can delete this message.",
      });
    }

    await Message.findByIdAndDelete(message._id);

    res.json({
      message: "Message deleted successfully",
      messageId: message._id,
      groupId: message.group,
      deletedBy: isGroupAdmin ? "admin" : "author",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
