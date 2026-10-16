import { Router } from "express";
import { listBanks } from "../services/bank.service";

export const banksRouter = Router();

banksRouter.get("/", (_req, res) => {
  res.json({ items: listBanks() });
});
