import { Router } from "express";
import { getWallet } from "./wallets.controller";

const walletRouter = Router();

walletRouter.get('/', getWallet);

export default walletRouter;
