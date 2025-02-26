import express from "express";
import { addPayment, searchPayment, updatePayment } from "../Controller/PaymentController.js";


const paymentRouter=express.Router();

paymentRouter.post("/",addPayment);
paymentRouter.get("/:Date",searchPayment);
paymentRouter.put("/",updatePayment);




export default paymentRouter;