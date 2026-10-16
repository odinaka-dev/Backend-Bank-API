"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = require("./routes");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: config_1.config.allowedOrigin,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Idempotency-Key", "X-Mock-Scenario"],
    }));
    app.use(express_1.default.json({ limit: config_1.config.jsonBodyLimit }));
    app.get("/", (_req, res) => {
        res.json({
            name: "Wayve Mock API",
            description: "Development-only simulated API; no real bank connectivity or transfers.",
            health: "/health",
            endpoints: [
                "GET /api/v1/account",
                "GET /api/v1/transactions?page=1&limit=20&search=&type=&status=&from=&to=",
                "GET /api/v1/transactions/:id",
                "POST /api/v1/transfers/resolve-account",
                "POST /api/v1/transfers",
                "GET /api/v1/transfers/:id/status",
                "GET /api/v1/banks",
            ],
        });
    });
    app.get("/health", (_req, res) => {
        res.json({
            status: "ok",
            service: "wayve-mock-api",
            timestamp: new Date().toISOString(),
        });
    });
    app.use("/api/v1", routes_1.apiRouter);
    app.use(error_handler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map