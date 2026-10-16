"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/** An error that maps directly to a JSON error response. */
class ApiError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = "ApiError";
    }
    toJSON() {
        return { message: this.message, code: this.code };
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=api-error.js.map