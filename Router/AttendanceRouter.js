import express, { Router } from "express";
import { getTeamStudent } from "../Controller/AttendanceController.js";


const attendanceRouter=express.Router();

attendanceRouter.get("/:TeamCode",getTeamStudent);

export default attendanceRouter;