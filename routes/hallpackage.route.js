import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import{
    createPackage,
    deletePackage,
    getPackage,
    getPackages
} from "../controllers/hallpackage.controller.js"
const router = express.Router();

router.post("/", verifyToken, createPackage);
router.delete("/:id", verifyToken, deletePackage); 
router.get("/single/:id",getPackage);
router.get("/", getPackages);

export default router; 