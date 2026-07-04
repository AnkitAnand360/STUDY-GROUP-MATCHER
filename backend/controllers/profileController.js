const User = require("../models/User");

// GET Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE Profile
exports.updateProfile = async (req, res) => {
  try {

    const {
      skills,
      subjects,
      studyGoal,
      availability,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        skills,
        subjects,
        studyGoal,
        availability,
      },
      {
        new: true,
      }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};