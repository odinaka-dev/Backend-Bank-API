"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = require("../utils/api-error");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof api_error_1.ApiError) {
        res.status(err.status).json(err.toJSON());
        return;
    }
    console.error("Unhandled mock API error:", err instanceof Error ? err.message : err);
    res.status(500).json({
        message: "An unexpected mock API error occurred",
        code: "INTERNAL_ERROR",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map