try {
  const dns = require("dns");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (e) {
  // Ignore DNS override errors in cloud environments
}

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

const profileRoutes = require("./routes/profileRoutes");

const matchRoutes = require("./routes/matchRoutes");

const messageRoutes = require("./routes/messageRoutes");

const groupRoutes = require("./routes/groupRoutes");

const plannerRoutes =
require("./routes/plannerRoutes");

const dashboardRoutes=
require("./routes/dashboardRoutes");

const notificationRoutes =
require("./routes/notificationRoutes");

connectDB();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server) or any localhost/vercel domain
    if (
      !origin ||
      origin.endsWith(".vercel.app") ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


app.use(express.json());

// Database readiness check middleware
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/api/health") {
    return next();
  }
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database Unavailable",
      message: "MongoDB is not connected. Please verify your MongoDB Atlas cluster is running and check MONGO_URI in backend/.env.",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/profile",
  profileRoutes
);

app.use("/api/match", matchRoutes);

app.use("/api/groups", groupRoutes);

app.use("/api/messages", messageRoutes);

app.use(
  "/api/planner",
  plannerRoutes
);

app.use(
"/api/dashboard",
dashboardRoutes
);

app.use(
"/api/notifications",
notificationRoutes
);

app.get("/", (req, res) => {
  res.send("Study Match API Running");
});

app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api/stats", async (req, res) => {
  try {
    const User = require("./models/User");
    const Group = require("./models/Group");
    const StudyPlan = require("./models/StudyPlan");

    const [totalUsers, totalGroups, plans] = await Promise.all([
      User.countDocuments().catch(() => 0),
      Group.countDocuments().catch(() => 0),
      StudyPlan.find({}).catch(() => []),
    ]);

    let totalTasks = 0;
    let completedTasks = 0;
    plans.forEach((plan) => {
      (plan.tasks || []).forEach((task) => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });
    });

    res.json({
      totalUsers,
      totalGroups,
      totalTasks,
      completedTasks,
      database: "connected",
    });
  } catch (error) {
    res.json({
      totalUsers: 0,
      totalGroups: 0,
      totalTasks: 0,
      completedTasks: 0,
      database: "disconnected",
    });
  }
});

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  socket.on("join-group", (groupId) => {
    socket.join(groupId);
  });

  socket.on("send-message", (data) => {
    if (!data.sender || !data.sender.name || data.sender.name === "Unknown") {
      data.sender = {
        _id: data.sender?._id || data.sender || "admin-id",
        name: "Admin",
        email: "",
      };
    }
    io.to(data.groupId).emit(
      "receive-message",
      data
    );
  });

  socket.on("delete-message", (data) => {
    io.to(data.groupId).emit(
      "message-deleted",
      data
    );
  });

  socket.on("delete-group", (data) => {
    io.to(data.groupId).emit(
      "group-deleted",
      data
    );
  });

  socket.on("invite-member", (data) => {
    io.to(data.groupId).emit(
      "member-joined",
      data
    );
  });

  socket.on("remove-member", (data) => {
    io.to(data.groupId).emit(
      "member-removed",
      data
    );
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});