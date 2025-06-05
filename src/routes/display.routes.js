import express from "express";
import { n50, sma } from "../controllers/display.controller.js";
import {  } from "../controllers/display.controller.js";
const router = express.Router();
router.get("/n-50",n50);
router.post("/sma",sma);
export default router;