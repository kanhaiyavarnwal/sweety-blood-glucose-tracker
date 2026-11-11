import express from "express";
import {addReading, getReadings, updateReading, deleteReading} from "../controllers/readingController.js";
const router = express.Router();
import {authMiddleware} from "../middleware/authMiddleware.js";
router.use(authMiddleware);

router.post("/add-reading",addReading )
router.get("/readings",getReadings )
router.put("/readings/:id",updateReading )
router.delete("/readings/:id",deleteReading )

export default router;