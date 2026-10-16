import { store } from "../data/store";
import type {
  Paginated,
  Transaction,
  TransactionQuery,
  TransactionStatus,
  TransactionType,
} from "../types";
import { ApiError } from "../utils/api-error";
import { includesValue, parseDate, queryString } from "../utils/helpers";

const TRANSACTION_TYPES: readonly TransactionType[] = ["credit", "debit"];
const TRANSACTION_STATUSES: readonly TransactionStatus[] = [
  "successful",
  "pending",
  "failed",
  "reversed",
];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** Converts raw Express query params into a validated TransactionQuery. */
export const parseTransactionQuery = (
  query: Record<string, unknown>,
): TransactionQuery => {
  const type = queryString(query.type).toLowerCase();
  const status = queryString(query.status).toLowerCase();
  return {
    page: Math.max(1, Number.parseInt(queryString(query.page), 10) || 1),
    limit: Math.min(
      MAX_LIMIT,
      Math.max(
        1,
        Number.parseInt(queryString(query.limit), 10) || DEFAULT_LIMIT,
      ),
    ),
    search: queryString(query.search).trim().toLowerCase(),
    type: includesValue(TRANSACTION_TYPES, type) ? type : undefined,
    status: includesValue(TRANSACTION_STATUSES, status) ? status : undefined,
    from: parseDate(query.from),
    to: parseDate(query.to),
  };
};

const searchableText = (t: Transaction) =>
  `${t.description} ${t.reference} ${t.recipient?.name ?? ""} ${t.sender?.name ?? ""}`.toLowerCase();

export const listTransactions = ({
  page,
  limit,
  search,
  type,
  status,
  from,
  to,
}: TransactionQuery): Paginated<Transaction> => {
  const filtered = [...store.transactions]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .filter((t) => !search || searchableText(t).includes(search))
    .filter((t) => !type || t.type === type)
    .filter((t) => !status || t.status === status)
    .filter((t) => !from || new Date(t.createdAt) >= from)
    .filter((t) => !to || new Date(t.createdAt) <= to);

  const total = filtered.length;
  const items = filtered.slice((page - 1) * limit, page * limit);
  return { items, page, limit, total, hasMore: page * limit < total };
};

export const getTransaction = (id: string): Transaction => {
  const transaction = store.transactions.find((t) => t.id === id);
  if (!transaction) {
    throw new ApiError(404, "TRANSACTION_NOT_FOUND", "Transaction not found");
  }
  return transaction;
};

export const recordTransaction = (transaction: Transaction): void => {
  store.transactions.unshift(transaction);
};
