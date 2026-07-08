const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

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

const {
  generateMatchExplanation,
} = require("./services/geminiService");

const groupRoutes = require("./routes/groupRoutes");

const plannerRoutes =
require("./routes/plannerRoutes");

const dashboardRoutes=
require("./routes/dashboardRoutes");

const notificationRoutes =
require("./routes/notificationRoutes");

connectDB();

app.use(cors());

app.use(express.json());

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

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  socket.on("join-group", (groupId) => {
    socket.join(groupId);
  });

  socket.on("send-message", (data) => {
    io.to(data.groupId).emit(
      "receive-message",
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