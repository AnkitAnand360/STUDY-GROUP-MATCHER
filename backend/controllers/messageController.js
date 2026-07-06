const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { groupId, text } = req.body;

    const message = await Message.create({
      group: groupId,
      sender: req.user.id,
      text,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

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

    const messages = await Message.find({
      group: req.params.groupId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};