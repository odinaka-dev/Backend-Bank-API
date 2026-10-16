import cors from "cors";
import express from "express";
import { config } from "./config";
import { errorHandler } from "./middleware/error-handler";
import { apiRouter } from "./routes";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: config.allowedOrigin,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Idempotency-Key", "X-Mock-Scenario"],
    }),
  );
  app.use(express.json({ limit: config.jsonBodyLimit }));

  app.get("/", (_req, res) => {
    res.json({
      name: "Wayve Mock API",
      description:
        "Development-only simulated API; no real bank connectivity or transfers.",
      health: "/health",
      endpoints: [
        "GET /api/v1/account",
        "GET /api/v1/transactions?page=1&limit=20&search=&type=&status=&from=&to=",
        "GET /api/v1/transactions/:id",
        "POST /api/v1/transfers/resolve-account",
        "POST /api/v1/transfers",
        "GET /api/v1/transfers/:id/status",
        "GET /api/v1/banks",
      ],
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "wayve-mock-api",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/v1", apiRouter);
  app.use(errorHandler);

  return app;
};
