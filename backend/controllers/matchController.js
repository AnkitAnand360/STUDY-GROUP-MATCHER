const User = require("../models/User");

exports.findMatches = async (req, res) => {

  try {

    const currentUser =
      await User.findById(req.user.id);

    const users =
      await User.find({
        _id: { $ne: currentUser._id },
      });

    const matches = users.map(user => {

      const score =
        calculateScore(
          currentUser,
          user
        );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        subjects: user.subjects,
        studyGoal: user.studyGoal,
        score,
      };

    });

    matches.sort(
      (a, b) => b.score - a.score
    );

    res.json(matches);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

function calculateScore(user, otherUser) {

  let score = 0;

  const commonSkills =
    user.skills.filter(skill =>
      otherUser.skills.includes(skill)
    );

  score += commonSkills.length * 20;

  const commonSubjects =
    user.subjects.filter(subject =>
      otherUser.subjects.includes(subject)
    );

  score += commonSubjects.length * 15;

  if (
    user.studyGoal &&
    user.studyGoal === otherUser.studyGoal
  ) {
    score += 20;
  }

  const commonDays =
    (user.availability?.days || []).filter(day =>
      (otherUser.availability?.days || []).includes(day)
    );

  const commonTime =
    (user.availability?.timeSlots || []).filter(time =>
      (otherUser.availability?.timeSlots || []).includes(time)
    );

  if (
    commonDays.length > 0 &&
    commonTime.length > 0
  ) {
    score += 10;
  }

  return score;
}