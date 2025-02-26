import express from "express";
import { addPayment } from "../Controller/PaymentController.js";


const paymentRouter=express.Router();

paymentRouter.post("/",addPayment);




export default paymentRouter;