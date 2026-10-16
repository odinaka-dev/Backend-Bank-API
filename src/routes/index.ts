import { Router } from "express";
import { accountRouter } from "./account.routes";
import { banksRouter } from "./banks.routes";
import { mockRouter } from "./mock.routes";
import { transactionsRouter } from "./transactions.routes";
import { transfersRouter } from "./transfers.routes";

export const apiRouter = Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/banks", banksRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/transfers", transfersRouter);
apiRouter.use("/mock", mockRouter);
