import express from "express";
import {  requestUser, LoginUser ,addcollector } from "../Controller/UserController.js";

const userRouter=express.Router();

userRouter.post("/",requestUser);
userRouter.post("/user",LoginUser);
userRouter.post("/collector",addcollector);

addcollector



export default userRouter;