"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = require("express");
const mock_scenario_1 = require("../middleware/mock-scenario");
const transaction_service_1 = require("../services/transaction.service");
exports.transactionsRouter = (0, express_1.Router)();
exports.transactionsRouter.get("/", (0, mock_scenario_1.mockScenario)({ errorMessage: "Transactions are temporarily unavailable" }), (req, res) => {
    res.json((0, transaction_service_1.listTransactions)((0, transaction_service_1.parseTransactionQuery)(req.query)));
});
exports.transactionsRouter.get("/:id", (0, mock_scenario_1.mockScenario)(), (req, res) => {
    res.json((0, transaction_service_1.getTransaction)(req.params.id));
});
//# sourceMappingURL=transactions.routes.js.map