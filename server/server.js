import "dotenv/config";
import app from "./app.js";
import { prisma } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected to database successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
}

startServer();
