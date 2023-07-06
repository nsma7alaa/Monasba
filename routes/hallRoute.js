const  express = require ("express");


const {
    createHall,
    deleteHall,
    getHall,
    getHalls
} = require("../controllers/hall.controller.js");
const authController = require ('../controllers/authController.js');
const router = express.Router();

router.use(authController.protect);

/////////////////////////////////trying

router.post("/", verifyToken, createHall);
router.delete("/:id", verifyToken, deleteHall);
router.get("/:placeId/single/:id", verifyToken, getHall);
router.get("/:placeId", verifyToken, getHalls);
 
module.exports = router;
    