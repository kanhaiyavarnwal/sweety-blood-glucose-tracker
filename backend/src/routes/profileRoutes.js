import express from "express"
import { changePassword, getProfile, updateProfile } from "../controllers/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router()

router.use(authMiddleware);
router.get("/my-profile",  getProfile);
router.put("/update-profile",  updateProfile);
router.put("/change-password",changePassword);
export default router