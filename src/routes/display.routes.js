import express from "express";
import { n50, sma } from "../controllers/display.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/n-50", authenticateUser, n50);
router.post("/sma", authenticateUser,sma);
export default router;