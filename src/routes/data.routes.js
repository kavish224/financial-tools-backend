import express from "express";
import { 
    n50, 
    sma, 
    getSMAByDate, 
    customsma, 
    getAvailableSMADates 
} from "../controllers/data.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validate, schemas } from "../utils/validation.js";


const router = express.Router();
router.get("/n-50", authenticateUser, n50);
router.post("/sma", authenticateUser, validate(schemas.sma), sma);
router.get("/sma/dates", authenticateUser, getAvailableSMADates);
router.post("/sma/by-date", authenticateUser, validate(schemas.smaByDate), getSMAByDate);
router.post("/sma/custom", authenticateUser, validate(schemas.customSma), customsma);
export default router;