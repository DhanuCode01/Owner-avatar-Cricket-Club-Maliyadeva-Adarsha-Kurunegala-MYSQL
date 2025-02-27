import express from "express";
import { getAttendance, getTeamStudent, markAttendance } from "../Controller/AttendanceController.js";


const attendanceRouter=express.Router();


attendanceRouter.get("/attendance",getAttendance);
attendanceRouter.get("/:TeamCode",getTeamStudent);
attendanceRouter.post("/",markAttendance);


export default attendanceRouter;