"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionTransfer = exports.getTransfer = exports.createTransfer = exports.toPublicTransfer = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_1 = require("../config");
const store_1 = require("../data/store");
const api_error_1 = require("../utils/api-error");
const helpers_1 = require("../utils/helpers");
const bank_service_1 = require("./bank.service");
const transaction_service_1 = require("./transaction.service");
const FINAL_STATUSES = [
    "successful",
    "failed",
    "reversed",
];
const toPublicTransfer = (t) => ({
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
exports.toPublicTransfer = toPublicTransfer;
const calculateFee = (amountMinor) => amountMinor >= config_1.transferRules.highValueThresholdMinor
    ? config_1.transferRules.highValueFeeMinor
    : config_1.transferRules.standardFeeMinor;
/** Adds the transfer to the transaction history, debiting the balance when successful. */
const settleTransfer = (transfer, status) => {
    const successful = status === "successful";
    if (successful) {
        store_1.store.account.availableBalanceMinor -=
            transfer.amountMinor + transfer.feeMinor;
    }
    (0, transaction_service_1.recordTransaction)({
        id: transfer.transactionId,
        reference: transfer.reference,
        amountMinor: transfer.amountMinor,
        currency: "NGN",
        type: "debit",
        status,
        description: transfer.narration || `Transfer to ${transfer.recipientName}`,
        createdAt: transfer.createdAt,
        recipient: {
            name: transfer.recipientName,
            bankName: transfer.recipientBankName,
            accountNumber: (0, helpers_1.maskAccountNumber)(transfer.recipientAccountNumber),
        },
        feeMinor: successful ? transfer.feeMinor : 0,
    });
};
const createTransfer = (input) => {
    const { idempotencyKey: key, scenario } = input;
    if (!key) {
        throw new api_error_1.ApiError(400, "IDEMPOTENCY_KEY_REQUIRED", "An idempotency key is required");
    }
    const existingId = store_1.store.idempotencyIndex.get(key);
    const existing = existingId ? store_1.store.transfers.get(existingId) : undefined;
    if (existing)
        return { transfer: existing, duplicate: true };
    const bank = (0, bank_service_1.findBank)(input.recipientBankCode);
    if (!bank) {
        throw new api_error_1.ApiError(400, "INVALID_BANK", "Select a valid recipient bank");
    }
    const accountNumber = (0, bank_service_1.assertValidAccountNumber)(input.recipientAccountNumber);
    const { amountMinor } = input;
    if (!(0, helpers_1.moneyIsValid)(amountMinor)) {
        throw new api_error_1.ApiError(400, "INVALID_AMOUNT", "Amount must be a positive integer in minor units (kobo)");
    }
    if (scenario === "reject") {
        throw new api_error_1.ApiError(422, "TRANSFER_REJECTED", "Transfer rejected by mock service");
    }
    if (amountMinor > store_1.store.account.availableBalanceMinor) {
        throw new api_error_1.ApiError(422, "INSUFFICIENT_BALANCE", "Insufficient available balance");
    }
    if (amountMinor > config_1.transferRules.maxAmountMinor) {
        throw new api_error_1.ApiError(422, "TRANSFER_LIMIT_EXCEEDED", "Amount exceeds the mock transfer limit");
    }
    const transactionId = `txn_transfer_${node_crypto_1.default.randomUUID()}`;
    const timestamp = (0, helpers_1.nowIso)();
    const transfer = {
        transactionId,
        id: transactionId,
        reference: `WAYVE-${Date.now()}`,
        status: scenario === "pending" || scenario === "unknown"
            ? "pending"
            : "successful",
        amountMinor,
        currency: "NGN",
        recipientBankCode: bank.bankCode,
        recipientBankName: bank.bankName,
        recipientAccountNumber: accountNumber,
        recipientName: (0, bank_service_1.lookupAccountName)(accountNumber),
        narration: String(input.narration ?? config_1.transferRules.defaultNarration).slice(0, config_1.transferRules.narrationMaxLength),
        feeMinor: calculateFee(amountMinor),
        createdAt: timestamp,
        updatedAt: timestamp,
        idempotencyKey: key,
    };
    store_1.store.transfers.set(transactionId, transfer);
    store_1.store.idempotencyIndex.set(key, transactionId);
    // In this mock only, a successful transfer updates the balance and creates a transaction.
    // Pending transfers are not deducted until the demo status is changed to successful.
    if (transfer.status === "successful")
        settleTransfer(transfer, "successful");
    return { transfer, duplicate: false };
};
exports.createTransfer = createTransfer;
const getTransfer = (id) => {
    const transfer = store_1.store.transfers.get(id);
    if (!transfer) {
        throw new api_error_1.ApiError(404, "TRANSFER_NOT_FOUND", "Transfer not found");
    }
    return transfer;
};
exports.getTransfer = getTransfer;
/** Demo-only: moves a pending transfer to a final status. */
const transitionTransfer = (id, status) => {
    const transfer = (0, exports.getTransfer)(id);
    if (!(0, helpers_1.includesValue)(FINAL_STATUSES, status)) {
        throw new api_error_1.ApiError(400, "INVALID_STATUS", "Status must be successful, failed, or reversed");
    }
    if (transfer.status !== "pending") {
        throw new api_error_1.ApiError(409, "INVALID_TRANSITION", "Only pending transfers can be transitioned");
    }
    transfer.status = status;
    transfer.updatedAt = (0, helpers_1.nowIso)();
    settleTransfer(transfer, status);
    return transfer;
};
exports.transitionTransfer = transitionTransfer;
//# sourceMappingURL=transfer.service.js.map