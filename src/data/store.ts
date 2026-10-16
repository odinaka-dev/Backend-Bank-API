import type { Account, Transaction, Transfer } from "../types";
import { buildSeedTransactions, seedAccount } from "./seed";

/** In-memory state for the mock API. Everything resets when the process restarts.*/
export const store = {
  account: { ...seedAccount } as Account,
  transactions: buildSeedTransactions() as Transaction[],
  transfers: new Map<string, Transfer>(),
  idempotencyIndex: new Map<string, string>(),
};
