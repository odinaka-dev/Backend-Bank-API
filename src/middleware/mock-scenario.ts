import type { RequestHandler } from "express";
import { latency } from "../config";
import { ApiError } from "../utils/api-error";
import { delay, getScenario } from "../utils/helpers";

interface ScenarioOptions {
  errorMessage?: string;
}

/** Applies the `slow` and (optionally) `error` read-endpoint scenarios. */
export const mockScenario =
  ({ errorMessage }: ScenarioOptions = {}): RequestHandler =>
  (req, _res, next) => {
    const scenario = getScenario(req);
    const proceed = () => {
      if (errorMessage && scenario === "error") {
        next(new ApiError(503, "SERVICE_UNAVAILABLE", errorMessage));
        return;
      }
      next();
    };
    if (scenario === "slow") delay(latency.slow).then(proceed, next);
    else proceed();
  };
