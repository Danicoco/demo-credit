import { Router } from "express";
import { isAuthenticated, validate } from "../../common/utils";
import { bankList, createPin, fundAccount, getWallet, resolveUserAccount, showPaystackInterface, transferFund, updatePin, verifyPin, withdrawFund } from "./wallets.controller";
import { validateAccountResolver, validateFundAccount, validatePaymentInterface, validatePin, validateTransferAccount, validateWithdrawFund } from "./wallets.validation";

const walletRouter = Router();

walletRouter.get('/', isAuthenticated, getWallet);
walletRouter.get('/banks', isAuthenticated, bankList);
walletRouter.route('/pins').post(isAuthenticated, validatePin(), validate, createPin).put(isAuthenticated, validatePin(true), validate, updatePin);
walletRouter.post('/verify-pin', isAuthenticated, validatePin(), validate, verifyPin);
walletRouter.post('/withdraw', isAuthenticated, validateWithdrawFund(), validate, withdrawFund);
walletRouter.post('/fund-account', isAuthenticated, validateFundAccount(), validate, fundAccount);
walletRouter.post('/resolve-account', isAuthenticated, validateAccountResolver(), validate, resolveUserAccount);
walletRouter.post('/transfer', isAuthenticated, validateTransferAccount(), validate, transferFund);
walletRouter.get('/secure-interface', validatePaymentInterface(), validate, showPaystackInterface);

export default walletRouter;
