import dotenv from "dotenv"
import connectDB from "./db/index.js"


dotenv.config({
    path:"./env"
})

connectDB()
.then(
    app.on("ERROR",()=>{
console.log("Error","faIleD to connecT")
throw Error
    }),
    app.listen(process.env.PORT || 5000,()=>{
console.log(`code is running on port: ${PORT}`)
    })
)
.catch("ERROR",(err)=>{
console.log('failed To cOnnect',err)
})














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