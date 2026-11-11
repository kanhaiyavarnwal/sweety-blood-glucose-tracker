import express from "express";
import { register, login ,getProfile} from "../controllers/authController.js";
import pool from "../config/db.js";
const router = express.Router();
import {authMiddleware} from "../middleware/authMiddleware.js";
router.post("/register",register);
router.post("/login",login);   

router.get("/me", authMiddleware, getProfile);

export   default router ;