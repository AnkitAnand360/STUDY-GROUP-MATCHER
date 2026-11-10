const Group = require("../models/Group");
const Message = require("../models/Message");
const User = require("../models/User");

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Join Group API
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          members: req.user.id,
        },
      },
      {
        new: true,
      }
    )
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json(group);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate("createdBy", "name email")
      .populate("members", "name email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate("createdBy", "name email")
      .populate("members", "name email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Group API (Admin only)
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.json({
        message: "Group deleted successfully",
        groupId: req.params.id,
      });
    }

    const currentUserId = req.user?.id ? req.user.id.toString() : "";
    const createdById = group.createdBy ? (group.createdBy._id || group.createdBy).toString() : "";

    // Allow deletion if current user created it, or createdBy is empty, or room created via Analytics ("Room with...")
    const isCreator = Boolean(
      !createdById ||
      (currentUserId && createdById === currentUserId) ||
      (group.name && group.name.toLowerCase().includes("room with")) ||
      (req.user?.role === "admin")
    );

    if (!isCreator) {
      return res.status(403).json({
        message: "Permission denied. Only the group admin can delete this group.",
      });
    }

    // Delete all messages in the group
    await Message.deleteMany({ group: group._id });
    await Group.findByIdAndDelete(group._id);

    res.json({
      message: "Group and its messages deleted successfully",
      groupId: group._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Invite / Add Member to Group API (Admin only)
exports.inviteMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const currentUserId = req.user.id ? req.user.id.toString() : "";
    const createdById = group.createdBy ? (group.createdBy._id || group.createdBy).toString() : "";

    const isAdmin = Boolean(currentUserId && createdById && currentUserId === createdById);

    if (!isAdmin) {
      return res.status(403).json({
        message: "Permission denied. Only the group admin can invite members.",
      });
    }

    const { email, userId, name } = req.body;
    let userToAdd = null;

    if (userId) {
      userToAdd = await User.findById(userId);
    } else if (email) {
      userToAdd = await User.findOne({ email: email.toLowerCase() });
    }

    // If not found, create a placeholder user for seamless collaboration
    if (!userToAdd && (email || name)) {
      try {
        userToAdd = await User.create({
          name: name || (email ? email.split("@")[0] : "New Member"),
          email: email ? email.toLowerCase() : `member-${Date.now()}@studymatch.io`,
          password: "demopassword123",
        });
      } catch (err) {
        userToAdd = await User.findOne({ email: email ? email.toLowerCase() : "" });
      }
    }

    if (userToAdd) {
      group.members.addToSet(userToAdd._id);
      await group.save();
    }

    const updatedGroup = await Group.findById(group._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json({
      message: "Member added successfully",
      group: updatedGroup,
      addedUser: userToAdd,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Member from Group API (Admin only)
exports.removeMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const currentUserId = req.user.id ? req.user.id.toString() : "";
    const createdById = group.createdBy ? (group.createdBy._id || group.createdBy).toString() : "";

    const isAdmin = Boolean(currentUserId && createdById && currentUserId === createdById);

    if (!isAdmin) {
      return res.status(403).json({
        message: "Permission denied. Only the group admin can remove members.",
      });
    }

    group.members.pull(req.params.userId);
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json({
      message: "Member removed successfully",
      group: updatedGroup,
      removedUserId: req.params.userId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
