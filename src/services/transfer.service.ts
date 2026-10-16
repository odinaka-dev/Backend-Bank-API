import crypto from "node:crypto";
import { transferRules } from "../config";
import { store } from "../data/store";
import type {
  CreateTransferInput,
  FinalTransferStatus,
  PublicTransfer,
  Transfer,
} from "../types";
import { ApiError } from "../utils/api-error";
import {
  includesValue,
  maskAccountNumber,
  moneyIsValid,
  nowIso,
} from "../utils/helpers";
import {
  assertValidAccountNumber,
  findBank,
  lookupAccountName,
} from "./bank.service";
import { recordTransaction } from "./transaction.service";

const FINAL_STATUSES: readonly FinalTransferStatus[] = [
  "successful",
  "failed",
  "reversed",
];

export const toPublicTransfer = (t: Transfer): PublicTransfer => ({
  transactionId: t.transactionId,
  reference: t.reference,
  status: t.status,
  amountMinor: t.amountMinor,
  currency: t.currency,
  recipientBankCode: t.recipientBankCode,
  recipientAccountNumber: t.recipientAccountNumber,
  recipientName: t.recipientName,
  feeMinor: t.feeMinor,
  totalDebitMinor: t.amountMinor + t.feeMinor,
  narration: t.narration,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

const calculateFee = (amountMinor: number) =>
  amountMinor >= transferRules.highValueThresholdMinor
    ? transferRules.highValueFeeMinor
    : transferRules.standardFeeMinor;

/** Adds the transfer to the transaction history, debiting the balance when successful. */
const settleTransfer = (
  transfer: Transfer,
  status: FinalTransferStatus,
): void => {
  const successful = status === "successful";
  if (successful) {
    store.account.availableBalanceMinor -=
      transfer.amountMinor + transfer.feeMinor;
  }
  recordTransaction({
    id: transfer.transactionId,
    reference: transfer.reference,
    amountMinor: transfer.amountMinor,
    currency: "NGN",
    type: "debit",
    status,
    description:
      transfer.narration || `Transfer to ${transfer.recipientName}`,
    createdAt: transfer.createdAt,
    recipient: {
      name: transfer.recipientName,
      bankName: transfer.recipientBankName,
      accountNumber: maskAccountNumber(transfer.recipientAccountNumber),
    },
    feeMinor: successful ? transfer.feeMinor : 0,
  });
};

export interface CreateTransferResult {
  transfer: Transfer;
  duplicate: boolean;
}

export const createTransfer = (
  input: CreateTransferInput,
): CreateTransferResult => {
  const { idempotencyKey: key, scenario } = input;

  if (!key) {
    throw new ApiError(
      400,
      "IDEMPOTENCY_KEY_REQUIRED",
      "An idempotency key is required",
    );
  }

  const existingId = store.idempotencyIndex.get(key);
  const existing = existingId ? store.transfers.get(existingId) : undefined;
  if (existing) return { transfer: existing, duplicate: true };

  const bank = findBank(input.recipientBankCode);
  if (!bank) {
    throw new ApiError(400, "INVALID_BANK", "Select a valid recipient bank");
  }
  const accountNumber = assertValidAccountNumber(input.recipientAccountNumber);
  const { amountMinor } = input;
  if (!moneyIsValid(amountMinor)) {
    throw new ApiError(
      400,
      "INVALID_AMOUNT",
      "Amount must be a positive integer in minor units (kobo)",
    );
  }

  if (scenario === "reject") {
    throw new ApiError(
      422,
      "TRANSFER_REJECTED",
      "Transfer rejected by mock service",
    );
  }
  if (amountMinor > store.account.availableBalanceMinor) {
    throw new ApiError(
      422,
      "INSUFFICIENT_BALANCE",
      "Insufficient available balance",
    );
  }
  if (amountMinor > transferRules.maxAmountMinor) {
    throw new ApiError(
      422,
      "TRANSFER_LIMIT_EXCEEDED",
      "Amount exceeds the mock transfer limit",
    );
  }

  const transactionId = `txn_transfer_${crypto.randomUUID()}`;
  const timestamp = nowIso();
  const transfer: Transfer = {
    transactionId,
    id: transactionId,
    reference: `WAYVE-${Date.now()}`,
    status:
      scenario === "pending" || scenario === "unknown"
        ? "pending"
        : "successful",
    amountMinor,
    currency: "NGN",
    recipientBankCode: bank.bankCode,
    recipientBankName: bank.bankName,
    recipientAccountNumber: accountNumber,
    recipientName: lookupAccountName(accountNumber),
    narration: String(input.narration ?? transferRules.defaultNarration).slice(
      0,
      transferRules.narrationMaxLength,
    ),
    feeMinor: calculateFee(amountMinor),
    createdAt: timestamp,
    updatedAt: timestamp,
    idempotencyKey: key,
  };
  store.transfers.set(transactionId, transfer);
  store.idempotencyIndex.set(key, transactionId);

  // In this mock only, a successful transfer updates the balance and creates a transaction.
  // Pending transfers are not deducted until the demo status is changed to successful.
  if (transfer.status === "successful") settleTransfer(transfer, "successful");

  return { transfer, duplicate: false };
};

export const getTransfer = (id: string): Transfer => {
  const transfer = store.transfers.get(id);
  if (!transfer) {
    throw new ApiError(404, "TRANSFER_NOT_FOUND", "Transfer not found");
  }
  return transfer;
};

/** Demo-only: moves a pending transfer to a final status. */
export const transitionTransfer = (id: string, status: unknown): Transfer => {
  const transfer = getTransfer(id);
  if (!includesValue(FINAL_STATUSES, status)) {
    throw new ApiError(
      400,
      "INVALID_STATUS",
      "Status must be successful, failed, or reversed",
    );
  }
  if (transfer.status !== "pending") {
    throw new ApiError(
      409,
      "INVALID_TRANSITION",
      "Only pending transfers can be transitioned",
    );
  }
  transfer.status = status;
  transfer.updatedAt = nowIso();
  settleTransfer(transfer, status);
  return transfer;
};
