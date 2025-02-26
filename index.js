import express from "express";
//import StudentRouter from './Router/StudentRouter.js';
import userRouter from "./Router/UserRouter.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"; 
import teamRouter from "./Router/TeamRouter.js";
import studentRouter from "./Router/StudentRouter.js";
import paymentRouter from "./Router/PaymentRouter.js";


dotenv.config();

const app=express();
app.use(bodyParser.json());

app.use((req,res,next)=>{
    
    let token=req.header  //midleware webtoken reading
    ("Authorization")
    
     if (token!=null){
        token=token.replace("Bearer ","") //"Bearer" Skip this word  
        jwt.verify(token,process.env.jwt_SECRET,
            (err,decoded)=>{                //get error or decoded value
                if(!err){
                    req.user=decoded;      //assign reqest user to decoded value  
                }
            }
        )
     }
     next() 
 
})  
  


//app.use("/api/student",StudentRouter);
    //http:localhost:3002/api/student
app.use("/api/user",userRouter);
app.use("/api/team",teamRouter);
app.use("/api/student",studentRouter);
app.use("/api/payment",paymentRouter);


    app.listen(3002,()=>{
        console.log("Server port 3002 is running ")})
   
 