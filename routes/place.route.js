import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import{
    createPlace,
    deletePlace,
    getPlace,
    getPlaces
} from "../controllers/place.controller.js"
const router = express.Router();

router.post("/", verifyToken, createPlace);
router.delete("/:id", verifyToken, deletePlace); 
router.get("/single/:id",getPlace);
router.get("/", getPlaces);

export default router; 
