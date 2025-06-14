import express from "express";
import { n50, sma, getAvailableSMADates, getSMAByDate } from "../controllers/display.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/n-50", authenticateUser, n50);
router.post("/sma", authenticateUser,sma);
router.get("/sma/dates", authenticateUser, getAvailableSMADates);
router.post("/sma/by-date", authenticateUser, getSMAByDate);

export default router;