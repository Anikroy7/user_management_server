
require("colors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dbConnect = require("./db/db");
const app = require("./app");

dotenv.config();

(async () => {
  try {
    // Connect to the database
    await dbConnect()


    //port
    const port = process.env.PORT || 8080;

    // Start the server
    const server = app.listen(port, () => {
      console.log(`Yay!!! User server is running on port ${port}`.bgMagenta.bold);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.disconnect();
        console.log("Database connection closed".bgYellow);
        server.close(() => {
          console.log("Server shut down gracefully".bgYellow);
          process.exit(0);
        });
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
})();
