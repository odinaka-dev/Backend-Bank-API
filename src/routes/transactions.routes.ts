import { Router } from "express";
import { mockScenario } from "../middleware/mock-scenario";
import {
  getTransaction,
  listTransactions,
  parseTransactionQuery,
} from "../services/transaction.service";

export const transactionsRouter = Router();

transactionsRouter.get(
  "/",
  mockScenario({ errorMessage: "Transactions are temporarily unavailable" }),
  (req, res) => {
    res.json(listTransactions(parseTransactionQuery(req.query)));
  },
);

transactionsRouter.get<{ id: string }>("/:id", mockScenario(), (req, res) => {
  res.json(getTransaction(req.params.id));
});
