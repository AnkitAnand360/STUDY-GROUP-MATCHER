const StudyPlan = require("../models/StudyPlan");
const Group = require("../models/Group");

exports.getDashboard = async (req, res) => {

  try {

    const plans =
      await StudyPlan.find({
        user: req.user.id
      });

    let totalTasks = 0;

    let completedTasks = 0;

    plans.forEach(plan => {

      plan.tasks.forEach(task => {

        totalTasks++;

        if(task.completed)
          completedTasks++;

      });

    });

    // Count Groups
    const groups =
await Group.find({
    members:req.user.id
});

const totalGroups =
groups.length;



    res.json({

      totalTasks,

      completedTasks,

      totalGroups

    });

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};