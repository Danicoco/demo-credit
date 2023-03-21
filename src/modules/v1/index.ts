import { Router } from "express";
import { isAuthenticated } from "../common/utils";
import walletRouter from "./wallets/wallets.route";
import customerRouters from "./customers/customers.route";

const router = Router();

router.use('/customer', customerRouters);
router.use('/wallet', walletRouter);

router.use("/", async (_req, res, _next) =>
  res.send("Welcome to Demo Credits API")
);

export default router;
