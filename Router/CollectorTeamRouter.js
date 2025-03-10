import express from "express";
import { addteam } from "../Controller/CollectionTeamController.js";


const collectorTeamRouter=express.Router();

collectorTeamRouter.post("/",addteam);




export default collectorTeamRouter;