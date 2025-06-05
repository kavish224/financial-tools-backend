import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import profileRoutes from './routes/profile.routes.js';
import displayRoutes from './routes/display.routes.js';
dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded data
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Stock Recommendation API!");
});
app.use("/api/auth", profileRoutes);
app.use("/api/data",displayRoutes)
export { app };
