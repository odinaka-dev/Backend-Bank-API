"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const seed_1 = require("./seed");
/**
 * In-memory state for the mock API. Everything resets when the process restarts.
 */
exports.store = {
    account: { ...seed_1.seedAccount },
    transactions: (0, seed_1.buildSeedTransactions)(),
    transfers: new Map(),
    /** idempotencyKey -> transactionId */
    idempotencyIndex: new Map(),
};
//# sourceMappingURL=store.js.map