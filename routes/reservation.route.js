import express from "express";
import {verifyToken} from "../middleware/jwt.js"
import { getReservations , intent} from "../controllers/reservation.controller.js";

const router = express.Router();

//router.post("/:placeId",verifyToken, createReservation);
router.get("/", verifyToken, getReservations);
router.post("/create-payment-intent/:id", verifyToken, intent);
//router.post("/", verifyToken, confirm);
export default router; 
 