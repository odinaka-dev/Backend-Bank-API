import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/api-error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json(err.toJSON());
    return;
  }
  console.error(
    "Unhandled mock API error:",
    err instanceof Error ? err.message : err,
  );
  res.status(500).json({
    message: "An unexpected mock API error occurred",
    code: "INTERNAL_ERROR",
  });
};
