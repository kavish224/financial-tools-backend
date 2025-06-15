import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { logger } from "./utils/logger.js";
import { IS_PRODUCTION } from "./constants.js";
import { rateLimiters } from "./utils/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import profileRoutes from './routes/profile.routes.js';
import displayRoutes from './routes/data.routes.js';
dotenv.config();
const app = express();
app.use(helmet({
  contentSecurityPolicy: IS_PRODUCTION ? undefined : false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(requestLogger);
const allowedOrigins = [
  'http://localhost:3000',
  'https://tools.kavishambani.in'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(rateLimiters.default);
app.use(express.json({ limit: "10mb", type: ['application/json', 'text/plain'] }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb", parameterLimit: 20 }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Stock Recommendation API",
    version: "1.0.0",
    environment: process.env.NODE_ENV
  });
});
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
app.use("/api/auth", profileRoutes);
app.use("/api/data",displayRoutes)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});
app.use(errorHandler);
export { app };
