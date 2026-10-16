"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordTransaction = exports.getTransaction = exports.listTransactions = exports.parseTransactionQuery = void 0;
const store_1 = require("../data/store");
const api_error_1 = require("../utils/api-error");
const helpers_1 = require("../utils/helpers");
const TRANSACTION_TYPES = ["credit", "debit"];
const TRANSACTION_STATUSES = [
    "successful",
    "pending",
    "failed",
    "reversed",
];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
/** Converts raw Express query params into a validated TransactionQuery. */
const parseTransactionQuery = (query) => {
    const type = (0, helpers_1.queryString)(query.type).toLowerCase();
    const status = (0, helpers_1.queryString)(query.status).toLowerCase();
    return {
        page: Math.max(1, Number.parseInt((0, helpers_1.queryString)(query.page), 10) || 1),
        limit: Math.min(MAX_LIMIT, Math.max(1, Number.parseInt((0, helpers_1.queryString)(query.limit), 10) || DEFAULT_LIMIT)),
        search: (0, helpers_1.queryString)(query.search).trim().toLowerCase(),
        type: (0, helpers_1.includesValue)(TRANSACTION_TYPES, type) ? type : undefined,
        status: (0, helpers_1.includesValue)(TRANSACTION_STATUSES, status) ? status : undefined,
        from: (0, helpers_1.parseDate)(query.from),
        to: (0, helpers_1.parseDate)(query.to),
    };
};
exports.parseTransactionQuery = parseTransactionQuery;
const searchableText = (t) => `${t.description} ${t.reference} ${t.recipient?.name ?? ""} ${t.sender?.name ?? ""}`.toLowerCase();
const listTransactions = ({ page, limit, search, type, status, from, to, }) => {
    const filtered = [...store_1.store.transactions]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .filter((t) => !search || searchableText(t).includes(search))
        .filter((t) => !type || t.type === type)
        .filter((t) => !status || t.status === status)
        .filter((t) => !from || new Date(t.createdAt) >= from)
        .filter((t) => !to || new Date(t.createdAt) <= to);
    const total = filtered.length;
    const items = filtered.slice((page - 1) * limit, page * limit);
    return { items, page, limit, total, hasMore: page * limit < total };
};
exports.listTransactions = listTransactions;
const getTransaction = (id) => {
    const transaction = store_1.store.transactions.find((t) => t.id === id);
    if (!transaction) {
        throw new api_error_1.ApiError(404, "TRANSACTION_NOT_FOUND", "Transaction not found");
    }
    return transaction;
};
exports.getTransaction = getTransaction;
const recordTransaction = (transaction) => {
    store_1.store.transactions.unshift(transaction);
};
exports.recordTransaction = recordTransaction;
//# sourceMappingURL=transaction.service.js.map