const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

const profileRoutes = require("./routes/profileRoutes");

const matchRoutes = require("./routes/matchRoutes");

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(
  "/api/profile",
  profileRoutes
);

app.use("/api/match", matchRoutes);

app.get("/", (req, res) => {
  res.send("Study Match API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});