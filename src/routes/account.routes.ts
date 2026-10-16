import { Router } from "express";
import { store } from "../data/store";
import { mockScenario } from "../middleware/mock-scenario";

export const accountRouter = Router();

accountRouter.get(
  "/",
  mockScenario({ errorMessage: "Account service is temporarily unavailable" }),
  (_req, res) => {
    res.json(store.account);
  },
);
