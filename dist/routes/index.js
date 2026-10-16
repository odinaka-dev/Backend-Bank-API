"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const account_routes_1 = require("./account.routes");
const banks_routes_1 = require("./banks.routes");
const mock_routes_1 = require("./mock.routes");
const transactions_routes_1 = require("./transactions.routes");
const transfers_routes_1 = require("./transfers.routes");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use("/account", account_routes_1.accountRouter);
exports.apiRouter.use("/banks", banks_routes_1.banksRouter);
exports.apiRouter.use("/transactions", transactions_routes_1.transactionsRouter);
exports.apiRouter.use("/transfers", transfers_routes_1.transfersRouter);
exports.apiRouter.use("/mock", mock_routes_1.mockRouter);
//# sourceMappingURL=index.js.map