"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAccount = exports.assertValidAccountNumber = exports.lookupAccountName = exports.findBank = exports.listBanks = void 0;
const seed_1 = require("../data/seed");
const api_error_1 = require("../utils/api-error");
const helpers_1 = require("../utils/helpers");
const listBanks = () => seed_1.knownBanks;
exports.listBanks = listBanks;
const findBank = (bankCode) => seed_1.knownBanks.find((b) => b.bankCode === String(bankCode));
exports.findBank = findBank;
const lookupAccountName = (accountNumber) => seed_1.knownAccountNames[accountNumber] ?? seed_1.DEFAULT_RECIPIENT_NAME;
exports.lookupAccountName = lookupAccountName;
const assertValidAccountNumber = (accountNumber) => {
    if (!(0, helpers_1.isTenDigitAccountNumber)(accountNumber)) {
        throw new api_error_1.ApiError(400, "INVALID_ACCOUNT_NUMBER", "Account number must contain exactly 10 digits");
    }
    return String(accountNumber);
};
exports.assertValidAccountNumber = assertValidAccountNumber;
const resolveAccount = (bankCode, accountNumber) => {
    const bank = bankCode ? (0, exports.findBank)(bankCode) : undefined;
    if (!bank)
        throw new api_error_1.ApiError(400, "INVALID_BANK", "Select a valid bank");
    const number = (0, exports.assertValidAccountNumber)(accountNumber);
    return {
        accountName: (0, exports.lookupAccountName)(number),
        bankCode: bank.bankCode,
        bankName: bank.bankName,
        accountNumber: number,
    };
};
exports.resolveAccount = resolveAccount;
//# sourceMappingURL=bank.service.js.map