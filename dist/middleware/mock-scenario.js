"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockScenario = void 0;
const config_1 = require("../config");
const api_error_1 = require("../utils/api-error");
const helpers_1 = require("../utils/helpers");
/** Applies the `slow` and (optionally) `error` read-endpoint scenarios. */
const mockScenario = ({ errorMessage } = {}) => (req, _res, next) => {
    const scenario = (0, helpers_1.getScenario)(req);
    const proceed = () => {
        if (errorMessage && scenario === "error") {
            next(new api_error_1.ApiError(503, "SERVICE_UNAVAILABLE", errorMessage));
            return;
        }
        next();
    };
    if (scenario === "slow")
        (0, helpers_1.delay)(config_1.latency.slow).then(proceed, next);
    else
        proceed();
};
exports.mockScenario = mockScenario;
//# sourceMappingURL=mock-scenario.js.map