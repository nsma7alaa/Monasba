const  express = require ("express");
router.use(authController.protect);

const {
    createHall,
    deleteHall,
    getHall,
    getHalls
} = require("../controllers/hall.controller.js");
const authController = require ('../controllers/authController.js');
const router = express.Router();

/////////////////////////////////trying

router.post("/", verifyToken, createHall);
router.delete("/:id", verifyToken, deleteHall);
router.get("/:placeId/single/:id", verifyToken, getHall);
router.get("/:placeId", verifyToken, getHalls);
 
module.exports = router;
    