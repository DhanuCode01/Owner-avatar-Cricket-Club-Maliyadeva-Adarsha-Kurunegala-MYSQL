import express from "express";
import { addPayment, searchPayment } from "../Controller/PaymentController.js";


const paymentRouter=express.Router();

paymentRouter.post("/",addPayment);
paymentRouter.get("/:Date",searchPayment);




export default paymentRouter;