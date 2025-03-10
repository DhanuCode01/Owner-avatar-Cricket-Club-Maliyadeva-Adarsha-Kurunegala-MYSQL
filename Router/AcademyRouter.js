import express from "express";
import { academyAdd, academyLogin, updateAcademy } from "../Controller/AcademyController.js";



const academyRouter=express.Router();


academyRouter.post("/",academyAdd);
academyRouter.get("/",academyLogin);
academyRouter.put("/",updateAcademy);



export default academyRouter;