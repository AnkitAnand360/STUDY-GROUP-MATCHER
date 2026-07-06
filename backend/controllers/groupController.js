const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  try {

    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(group);

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
    );

    res.json(group);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};