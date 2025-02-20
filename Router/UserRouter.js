import express from "express";
import {  requestCoach, LoginCoach ,addcollector,LoginCollector } from "../Controller/UserController.js";

const userRouter=express.Router();

userRouter.post("/coach",requestCoach);
userRouter.get("/coach",LoginCoach);
userRouter.post("/collector",addcollector);
userRouter.get("/collector",LoginCollector);

addcollector



export default userRouter;