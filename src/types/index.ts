export type Currency = "NGN";

export type TransactionType = "credit" | "debit";

export type TransactionStatus = "successful" | "pending" | "failed" | "reversed";

export type FinalTransferStatus = Exclude<TransactionStatus, "pending">;

export type TransferStatus = TransactionStatus;

export type MockScenario =
  | "success"
  | "slow"
  | "error"
  | "reject"
  | "pending"
  | "unknown"
  | "timeout";

export interface Account {
  accountId: string;
  accountNumber: string;
  accountName: string;
  currency: Currency;
  availableBalanceMinor: number;
}

export interface Bank {
  bankCode: string;
  bankName: string;
}

export interface Counterparty {
  name: string;
  bankName?: string;
  accountNumber?: string;
}

export interface Transaction {
  id: string;
  reference: string;
  amountMinor: number;
  currency: Currency;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: string;
  recipient?: Counterparty;
  sender?: Counterparty;
  feeMinor: number;
}

export interface Transfer {
  transactionId: string;
  id: string;
  reference: string;
  status: TransferStatus;
  amountMinor: number;
  currency: Currency;
  recipientBankCode: string;
  recipientBankName: string;
  recipientAccountNumber: string;
  recipientName: string;
  narration: string;
  feeMinor: number;
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
}

export interface PublicTransfer {
  transactionId: string;
  reference: string;
  status: TransferStatus;
  amountMinor: number;
  currency: Currency;
  recipientBankCode: string;
  recipientAccountNumber: string;
  recipientName: string;
  feeMinor: number;
  totalDebitMinor: number;
  narration: string;
  createdAt: string;
  updatedAt: string;
  duplicate?: boolean;
}

export interface ResolvedAccount {
  accountName: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface TransactionQuery {
  page: number;
  limit: number;
  search: string;
  type?: TransactionType;
  status?: TransactionStatus;
  from?: Date;
  to?: Date;
}

export interface CreateTransferInput {
  recipientBankCode: unknown;
  recipientAccountNumber: unknown;
  amountMinor: unknown;
  narration?: unknown;
  idempotencyKey: string;
  scenario: string;
}

export interface ErrorBody {
  message: string;
  code: string;
}
