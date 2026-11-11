import express from "express";

const router = express.Router();

import {
  getDailyReport,
  getMonthlyReport,
} from "../controllers/reportController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.get("/daily-report", getDailyReport);
router.get("/monthly-report", getMonthlyReport);

export default router;
