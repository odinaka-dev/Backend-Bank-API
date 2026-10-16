import { Router } from "express";
import {
  toPublicTransfer,
  transitionTransfer,
} from "../services/transfer.service";

/** Demo-only endpoints for driving mock state during testing. */
export const mockRouter = Router();

mockRouter.post("/transfers/:id/status", (req, res) => {
  const transfer = transitionTransfer(req.params.id, req.body?.status);
  res.json(toPublicTransfer(transfer));
});
