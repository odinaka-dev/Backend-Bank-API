"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banksRouter = void 0;
const express_1 = require("express");
const bank_service_1 = require("../services/bank.service");
exports.banksRouter = (0, express_1.Router)();
exports.banksRouter.get("/", (_req, res) => {
    res.json({ items: (0, bank_service_1.listBanks)() });
});
//# sourceMappingURL=banks.routes.js.map