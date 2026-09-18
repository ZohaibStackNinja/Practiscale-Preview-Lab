import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { projectRouter } from "./routes/projectRoutes.js";
import { variantRouter } from "./routes/variantRoutes.js";
import { shareRouter } from "./routes/shareRoutes.js";
import { sampleRouter } from "./routes/sampleRoutes.js";

const uploadsDir = path.resolve(process.cwd(), "uploads");

const app = express();

// Security and middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or matching frontend
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Static uploads directory for local preview assets
app.use("/uploads", express.static(uploadsDir));

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: "healthy",
      app: "Practiscale Preview Lab API",
      timestamp: new Date().toISOString(),
    },
    error: null,
  });
});

// Mount modular API routes
app.use("/api/projects", projectRouter);
app.use("/api/variants", variantRouter);
app.use("/api/shares", shareRouter);
app.use("/api/sample", sampleRouter);

// Central error handler
app.use(errorHandler);

// Start server
async function bootstrap() {
  await connectDB();
  const port = parseInt(ENV.PORT, 10) || 5000;
  app.listen(port, () => {
    console.log(
      `[Server] Practiscale Preview Lab API running on http://localhost:${port}`,
    );
    console.log(`[Server] Health check: http://localhost:${port}/api/health`);
  });
}

bootstrap().catch((err) => {
  console.error("[Server] Fatal startup error:", err);
  process.exit(1);
});
