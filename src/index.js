// import dotenv from "dotenv"
// import connectDB from "./db/index.js"
// import { app } from "./app.js"

// dotenv.config({
//     path:"./.env"
// })

// connectDB()

// .then(
    
//     app.on("error",(err)=>{
// console.log("Error","faIleD to connecT",err)
// throw Error
//     }),

//     app.listen( process.env.PORT|| 5000,()=>{
// console.log(`code is running on port: ${process.env.PORT}`)
//     })
// )
// .catch("ERROR",(err)=>{
// console.log('failed To cOnnect',err)
// })


import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config({
    path: "./.env",
});

app.on("error", (err) => {
  console.error("Error: Failed to connect", err);
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Code is running on port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit the process if the DB connection fails
  });













/*
import express from "express"
const app = express()
//using iffy method
//using async and try and catch method
(async()=>{
try{
await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
app.on("error",()=>{
    console.log("ERR","app is not connect to db")
    throw error
})
app.listen(process.env.PORT,()=>{
console.log(`app is running on port ${process.env.PORT}`)
})
}
catch(error){}
console.log("error",error)
})()
*/