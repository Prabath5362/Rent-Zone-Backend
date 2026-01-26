import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import jwt from "jsonwebtoken"
import cors from "cors"
import bookingRouter from "./routes/bookingRoute.js"
import categoryRouter from "./routes/categoryRoute.js"

const app = express()
app.use(cors())
app.use(bodyParser.json())

dotenv.config()
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(()=>{
    console.log("Mongodb connected successfully!");
    
}).catch((e)=>{
    console.log(e);
    
})

app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use("/api/booking",bookingRouter)
app.use("/api/category",categoryRouter);

app.get("/",(req,res)=>{
    res.send("Server updated is running on port 3000");
})


app.listen(3000,()=>{
    console.log("Server updated and is running on port 3000");
})


