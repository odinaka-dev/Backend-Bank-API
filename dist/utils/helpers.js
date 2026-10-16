"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includesValue = exports.parseDate = exports.queryString = exports.getScenario = exports.nowIso = exports.maskAccountNumber = exports.isTenDigitAccountNumber = exports.moneyIsValid = exports.delay = void 0;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.delay = delay;
const moneyIsValid = (value) => Number.isSafeInteger(value) && value > 0;
exports.moneyIsValid = moneyIsValid;
const isTenDigitAccountNumber = (value) => /^\d{10}$/.test(String(value ?? ""));
exports.isTenDigitAccountNumber = isTenDigitAccountNumber;
const maskAccountNumber = (accountNumber) => `******${accountNumber.slice(-4)}`;
exports.maskAccountNumber = maskAccountNumber;
const nowIso = () => new Date().toISOString();
exports.nowIso = nowIso;
/** Reads the `X-Mock-Scenario` header used to trigger simulated behaviours. */
const getScenario = (req) => req.get("X-Mock-Scenario");
exports.getScenario = getScenario;
/** Normalises an Express query value to a single string. */
const queryString = (value) => typeof value === "string" ? value : "";
exports.queryString = queryString;
const parseDate = (value) => {
    const raw = (0, exports.queryString)(value);
    if (!raw)
        return undefined;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? undefined : date;
};
exports.parseDate = parseDate;
const includesValue = (values, value) => values.includes(value);
exports.includesValue = includesValue;
//# sourceMappingURL=helpers.js.map