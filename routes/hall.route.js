import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import{
    createHall,
    deleteHall,
    getHall,
    getHalls
} from "../controllers/hall.controller.js"
const router = express.Router();

router.post("/", verifyToken, createHall);
router.delete("/:id", verifyToken, deleteHall);
router.get("/:placeId/single/:id", verifyToken, getHall);
router.get("/:placeId", verifyToken, getHalls);
 
export default router;
