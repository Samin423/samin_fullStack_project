//require("dotenv").config({path: ".env"});

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("ERROR IN DB CONNECTION: ", error);
  });

















//one approch to connect to data base and start server
/*
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect('${process.env.MONGO_URI}/${DB_NAME}')
    app.on("ERROR",(error)=> {     // event listener for server error                 
        console.log("Error: ",error);
        throw error;
    })   

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
})();

*/
