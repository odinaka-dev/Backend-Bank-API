"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRouter = void 0;
const express_1 = require("express");
const transfer_service_1 = require("../services/transfer.service");
/** Demo-only endpoints for driving mock state during testing. */
exports.mockRouter = (0, express_1.Router)();
exports.mockRouter.post("/transfers/:id/status", (req, res) => {
    const transfer = (0, transfer_service_1.transitionTransfer)(req.params.id, req.body?.status);
    res.json((0, transfer_service_1.toPublicTransfer)(transfer));
});
//# sourceMappingURL=mock.routes.js.map