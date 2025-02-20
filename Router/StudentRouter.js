import express from "express";
import { addStudent, getStudent } from "../Controller/StudentController.js";



const studentRouter=express.Router();

studentRouter.post("/",addStudent);
studentRouter.get("/:SID",getStudent);



export default studentRouter;