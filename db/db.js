// db.js
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkiyzka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);
    console.log("Database connection is successful".bgGreen);
  } catch (error) {
    console.error("Database connection error:", error);
    throw error; 
  }
};

module.exports = dbConnect;
