const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️ MONGO_URI is not defined in backend/.env");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("\n❌ ================= MongoDB Connection Notice =================");
    console.error(`Status: Unable to connect to MongoDB`);
    console.error(`Details: ${error.message}`);

    if (error.message.includes("querySrv ENOTFOUND") || error.message.includes("ENOTFOUND")) {
      console.error("\n🔍 Diagnosis: The MongoDB Atlas host could not be resolved via DNS.");
      console.error("Common causes & how to fix:");
      console.error("  1. Free MongoDB Atlas cluster was PAUSED due to inactivity:");
      console.error("     👉 Log in to https://cloud.mongodb.com and click 'Resume' on your cluster.");
      console.error("  2. Cluster was deleted or connection string changed:");
      console.error("     👉 In Atlas, click 'Connect' -> Drivers -> Copy URI -> update MONGO_URI in backend/.env.");
      console.error("  3. Atlas Network Access needs IP whitelist:");
      console.error("     👉 In Atlas, go to Network Access -> Add IP Address -> '0.0.0.0/0' (Allow from Anywhere).");
    }
    console.error("=================================================================\n");
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection active");
});

module.exports = connectDB;