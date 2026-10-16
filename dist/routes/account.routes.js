"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
const express_1 = require("express");
const store_1 = require("../data/store");
const mock_scenario_1 = require("../middleware/mock-scenario");
exports.accountRouter = (0, express_1.Router)();
exports.accountRouter.get("/", (0, mock_scenario_1.mockScenario)({ errorMessage: "Account service is temporarily unavailable" }), (_req, res) => {
    res.json(store_1.store.account);
});
//# sourceMappingURL=account.routes.js.map