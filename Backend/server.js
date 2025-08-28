import { app } from "./app.js";
import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./Database/index.js";
import userRouter from "./Routes/userroute.js";
dotenv.config({ path: "/home/nitish/Desktop/Chatapp/Backend/.env" });


//Default middleware//
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const PORT = process.env.PORT||8000;
const MONGO_DB = process.env.MONGO_DB


app.get('/home',(req,res) => {
    res.send('hello')
})

app.use('/api/users',userRouter)


connectDB(MONGO_DB)
.then(() => {
    app.listen(PORT,() => console.log(`port is running on ${PORT}`))
})
.catch((error) => {
    console.log("Database is failed to connect");
})

