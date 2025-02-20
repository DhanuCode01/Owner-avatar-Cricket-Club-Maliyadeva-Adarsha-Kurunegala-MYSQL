import express from "express";
import { addteam } from "../Controller/TeamController.js";



const teamRouter=express.Router();

teamRouter.post("/",addteam);



export default teamRouter;