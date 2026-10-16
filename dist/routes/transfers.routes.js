"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfersRouter = void 0;
const express_1 = require("express");
const config_1 = require("../config");
const async_handler_1 = require("../middleware/async-handler");
const bank_service_1 = require("../services/bank.service");
const transfer_service_1 = require("../services/transfer.service");
const helpers_1 = require("../utils/helpers");
exports.transfersRouter = (0, express_1.Router)();
exports.transfersRouter.post("/resolve-account", (0, async_handler_1.asyncHandler)(async (req, res) => {
    await (0, helpers_1.delay)(config_1.latency.resolveAccount);
    const { bankCode, accountNumber } = req.body ?? {};
    res.json((0, bank_service_1.resolveAccount)(bankCode, accountNumber));
}));
exports.transfersRouter.post("/", (0, async_handler_1.asyncHandler)(async (req, res) => {
    const body = req.body ?? {};
    const scenario = (0, helpers_1.getScenario)(req) || body.scenario || "success";
    const { transfer, duplicate } = (0, transfer_service_1.createTransfer)({
        recipientBankCode: body.recipientBankCode,
        recipientAccountNumber: body.recipientAccountNumber,
        amountMinor: body.amountMinor,
        narration: body.narration,
        idempotencyKey: String(body.idempotencyKey || req.get("Idempotency-Key") || "").trim(),
        scenario: String(scenario),
    });
    if (duplicate) {
        res.status(200).json({ ...(0, transfer_service_1.toPublicTransfer)(transfer), duplicate: true });
        return;
    }
    // The "timeout" scenario stores the transfer but deliberately delays the response,
    // simulating an accepted request whose response may not reach the client in time.
    await (0, helpers_1.delay)(scenario === "timeout" ? config_1.latency.transferTimeout : config_1.latency.transfer);
    res.status(201).json((0, transfer_service_1.toPublicTransfer)(transfer));
}));
exports.transfersRouter.get("/:id/status", (req, res) => {
    res.json((0, transfer_service_1.toPublicTransfer)((0, transfer_service_1.getTransfer)(req.params.id)));
});
//# sourceMappingURL=transfers.routes.js.map