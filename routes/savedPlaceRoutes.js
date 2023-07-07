const express = require ("express");
const { verifyToken } = require ("../middleware/jwt.js");
const {
    createSaved,
    getsavers,
    deleteSaved,
} = require ("../controllers/savedController.js");
const { protect } = require("../controllers/authController.js");

const router = express.Router();


router.use(protect)
router.post("/",verifyToken, createSaved )
router.get("/savedPlace", getsavers )
router.delete("/:savedPlaceid",verifyToken, deleteSaved )

module.exports = router;
