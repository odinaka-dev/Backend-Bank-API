import { Router } from "express";
import { latency } from "../config";
import { asyncHandler } from "../middleware/async-handler";
import { resolveAccount } from "../services/bank.service";
import {
  createTransfer,
  getTransfer,
  toPublicTransfer,
} from "../services/transfer.service";
import { delay, getScenario } from "../utils/helpers";

export const transfersRouter = Router();

transfersRouter.post(
  "/resolve-account",
  asyncHandler(async (req, res) => {
    await delay(latency.resolveAccount);
    const { bankCode, accountNumber } = req.body ?? {};
    res.json(resolveAccount(bankCode, accountNumber));
  }),
);

transfersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {};
    const scenario = getScenario(req) || body.scenario || "success";

    const { transfer, duplicate } = createTransfer({
      recipientBankCode: body.recipientBankCode,
      recipientAccountNumber: body.recipientAccountNumber,
      amountMinor: body.amountMinor,
      narration: body.narration,
      idempotencyKey: String(
        body.idempotencyKey || req.get("Idempotency-Key") || "",
      ).trim(),
      scenario: String(scenario),
    });

    if (duplicate) {
      res.status(200).json({ ...toPublicTransfer(transfer), duplicate: true });
      return;
    }

    // The "timeout" scenario stores the transfer but deliberately delays the response,
    // simulating an accepted request whose response may not reach the client in time.
    await delay(
      scenario === "timeout" ? latency.transferTimeout : latency.transfer,
    );
    res.status(201).json(toPublicTransfer(transfer));
  }),
);

transfersRouter.get("/:id/status", (req, res) => {
  res.json(toPublicTransfer(getTransfer(req.params.id)));
});
