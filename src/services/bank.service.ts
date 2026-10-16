import {
  DEFAULT_RECIPIENT_NAME,
  knownAccountNames,
  knownBanks,
} from "../data/seed";
import type { Bank, ResolvedAccount } from "../types";
import { ApiError } from "../utils/api-error";
import { isTenDigitAccountNumber } from "../utils/helpers";

export const listBanks = (): readonly Bank[] => knownBanks;

export const findBank = (bankCode: unknown): Bank | undefined =>
  knownBanks.find((b) => b.bankCode === String(bankCode));

export const lookupAccountName = (accountNumber: string): string =>
  knownAccountNames[accountNumber] ?? DEFAULT_RECIPIENT_NAME;

export const assertValidAccountNumber = (accountNumber: unknown): string => {
  if (!isTenDigitAccountNumber(accountNumber)) {
    throw new ApiError(
      400,
      "INVALID_ACCOUNT_NUMBER",
      "Account number must contain exactly 10 digits",
    );
  }
  return String(accountNumber);
};

export const resolveAccount = (
  bankCode: unknown,
  accountNumber: unknown,
): ResolvedAccount => {
  const bank = bankCode ? findBank(bankCode) : undefined;
  if (!bank) throw new ApiError(400, "INVALID_BANK", "Select a valid bank");

  const number = assertValidAccountNumber(accountNumber);
  return {
    accountName: lookupAccountName(number),
    bankCode: bank.bankCode,
    bankName: bank.bankName,
    accountNumber: number,
  };
};
