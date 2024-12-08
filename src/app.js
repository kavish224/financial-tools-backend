import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// Initialize the Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
})); // Enable Cross-Origin Resource Sharing
app.use(express.json({limit:"16kb"}))
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded data
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan("dev")); // Logging middleware for HTTP requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to the Stock Recommendation API!");
});

// Export the app instance
export { app };
