import express from "express";
import { addStudent } from "../Controller/StudentController.js";



const studentRouter=express.Router();

studentRouter.post("/",addStudent);



export default studentRouter;