import { format } from "date-fns";
import { randomBytes } from "crypto";
import { Request, Response, NextFunction } from "express";

import {
    success,
  catchError,
  composeAmount,
  createSha512Hash,
} from "../../common/utils";
import db from "../../../../databases";
import Paystack from "../../common/paystack";
import WalletService from "./wallets.service";
import CustomerService from "../customers/customers.service";

const { BASE_MAIN_URL, PAYSTACK_PUB_KEY } = process.env;

if (typeof BASE_MAIN_URL !== "string" || typeof PAYSTACK_PUB_KEY !== "string") {
  throw catchError("Add Paystack credentials to env");
}

export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { id },
  } = req;
  try {
    let result;
    const service = new WalletService("", id);
    result = await service.findOne().catch(() => {
      throw catchError("An error occurred!!", 500);
    });
    console.log(result, "Before create");

    if (!result) {
      const customer = await new CustomerService(id).findOne().catch(() => {
        throw catchError("An error occurred!", 500);
      });
      // yymmddssms
      const wallet = await service.create({
        customerId: id,
        balance: composeAmount(0),
        ledgerBalance: composeAmount(0),
        lastBalanceUpdateAt: new Date().toISOString(),
        accountNumber: format(new Date(), "yyMMddssSS"),
        lastLedgerBalanceUpdateAt: new Date().toISOString(),
        accountName: `${customer.firstName}  ${customer.lastName}`,
      });
      result = await new WalletService(wallet[0]).findOne().catch(() => {
        throw catchError("An error occurred!", 500);
      });
    }

    console.log(result, "Before create");

    return res
      .status(200)
      .json(success("Wallet retrieved succesfully", result));
  } catch (error) {
    next(error);
  }
};

export const fundAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { id },
    body: { reference },
  } = req;
  try {
    const [verifyPayment, wallet] = await Promise.all([
      new Paystack(reference).verifyTransaction(),
      new WalletService("", id).findOne(),
    ]).catch(() => {
      throw catchError("There was an error verifying your funding", 500);
    });

    if (!wallet) throw catchError("You do not have a wallet account yet", 404);
    if (verifyPayment) {
      throw catchError("Unable to verify your funding at the moment", 400);
    }

    const { amount } = verifyPayment;
    const transaction = await db.transaction();
    const fund = await new WalletService(wallet.id)
      .balanceHandler(
        "credit",
        Number(amount),
        {
          reference,
          status: "success",
          description: `Funded account with ${amount}`,
        },
        transaction,
        true
      )
      .catch(() => {
        transaction.rollback();
        throw catchError("Error processing your fund", 500);
      });
    transaction.commit();

    return res.status(200).json(
      success("Funded successfully", {
        fund,
        verifyPayment,
      })
    );
  } catch (error) {
    next(error);
  }
};0

export const transferFund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { pin, note, amount, accountNumber },
    user: { id },
  } = req;
  try {
    const [wallet, receiver] = await Promise.all([
      new WalletService("", id).findOne(),
      new WalletService("", "", accountNumber).findOne(),
    ]).catch(() => {
      throw catchError("An error occured!", 500);
    });

    if (!wallet) throw catchError("You do not have a wallet account yet", 404);
    if (!wallet.pin) throw catchError("You're yet to create your pin", 400);
    if (wallet.pin !== pin) throw catchError("Incorrect pin provided");
    if (Number(amount) > Number(wallet.balance))
      throw catchError("Insufficient balance", 400);

    if (!receiver)
      throw catchError("You can't transfer to invalid account", 404);

    const transaction = await db.transaction();
    const reference = randomBytes(10).toString("hex");
    await Promise.all([
      new WalletService(wallet.id).balanceHandler(
        "debit",
        Number(amount),
        { reference, status: "success", description: `${note}-Demo Credit` },
        transaction,
        true
      ),
      new WalletService(receiver.id).balanceHandler(
        "credit",
        Number(amount),
        { reference, status: "success", description: `${note}-Demo Credit` },
        transaction,
        true
      ),
    ]).catch(() => {
      transaction.rollback();
      throw catchError("Error processing your transfer", 500);
    });
    transaction.commit();

    return res.status(200).json(success("Fund transferred successfully", {}));
  } catch (error) {
    next(error);
  }
};

export const withdrawFund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { pin, amount },
    user: { id },
  } = req;
  try {
    const service = new WalletService("", id);
    const wallet = await service.findOne().catch(() => {
      throw catchError("An error occurred!", 500);
    });

    if (!wallet) throw catchError("You do not have a wallet account yet", 404);
    if (!wallet.pin) throw catchError("You're yet to create an account", 400);
    if (wallet.pin !== pin) throw catchError("Incorrect pin provided", 400);
    if (Number(amount) > Number(wallet.balance))
      throw catchError("Insufficient fund", 400);

    const transaction = await db.transaction();
    const reference = randomBytes(10).toString("hex");
    await service
      .balanceHandler(
        "debit",
        Number(amount),
        {
          reference,
          status: "success",
          description: `Withdraw ${amount}`,
        },
        transaction,
        true
      )
      .catch(() => {
        transaction.rollback();
        throw catchError("An error occurred!", 500);
      });
    transaction.commit();

    return res.status(200).json(success("Withdraw successfully", {}));
  } catch (error) {
    next(error);
  }
};

export const resolveAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accountNumber, bankCode } = req.body;
  try {
    const account = await new Paystack()
      .verifyAccountDetails(accountNumber, bankCode)
      .catch(() => {
        throw catchError("An error occurred!", 500);
      });

    return res
      .status(200)
      .json(success("Account resolved successfully", account));
  } catch (error) {
    next(error);
  }
};

export const bankList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const banks = await new Paystack().getBankList().catch(() => {
      throw catchError("An error occurred!", 500);
    });

    return res.status(200).json(success("Banks retrieved", banks));
  } catch (error) {
    next(error);
  }
};

export const resolveUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accountNumber } = req.body;
  try {
    const wallet = await new WalletService("", "", accountNumber)
      .findOne()
      .catch(() => {
        throw catchError("An error occurred!", 500);
      });

    return res
      .status(200)
      .json(success("Account retrieved successfully", wallet));
  } catch (error) {
    next(error);
  }
};

export const createPin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { pin },
    user: { id },
  } = req;
  try {
    const wallet = await new WalletService("", id).findOne().catch((e) => {
      throw catchError("An error occurred!", 500);
    });

    if (!wallet) throw catchError("You do not have a wallet account yet", 404);
    if (wallet.pin) throw catchError("You already created your pin", 400);

    const newWallet = await new WalletService(wallet.id).update({
      pin: createSha512Hash(pin),
    });

    return res.status(200).json(success("Pin created successfully", newWallet));
  } catch (error) {
    next(error);
  }
};

export const verifyPin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { pin },
    user: { id },
  } = req;
  try {
    const wallet = await new WalletService("", id).findOne().catch(() => {
      throw catchError("An error occurred!", 500);
    });

    if (!wallet) throw catchError("You do not have a wallet account yet", 404);
    if (!wallet.pin) throw catchError("Proceed to create your pin", 400);

    const isVerified = wallet.pin === createSha512Hash(pin);

    return res.status(200).json(
      success("Pin verification result", {
        wallet,
        isVerified,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updatePin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { pin, oldPin },
    user: { id },
  } = req;
  try {
    const wallet = await new WalletService("", id).findOne().catch(() => {
      throw catchError("An error occurred!", 500);
    });

    if (!wallet) throw catchError("You do not have a wallet account yet", 404);
    if (!wallet.pin) throw catchError("Proceed to create your pinn", 400);
    if (wallet.pin !== createSha512Hash(oldPin))
      throw catchError("Your new pin is incorrect", 400);

    const newWallet = await new WalletService(wallet.id)
      .update({
        pin: createSha512Hash(pin),
        pinChangedAt: new Date().toISOString(),
      })
      .catch(() => {
        throw catchError("An error occurred!", 500);
      });

    return res.status(200).json(
      success("Pin update successfully", {
        pinUpdated: !!newWallet,
        wallet: newWallet,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const showPaystackInterface = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    query: { purpose, amount, customerId, email },
  } = req;

  const reference = randomBytes(10).toString("hex");

  const amountToPay = Number(amount) * 100;

  try {
    return res.render(purpose === "tokenization" ? "tokenization" : "payment", {
      email,
      reference,
      customerId,
      amount: amountToPay,
      paymentType: purpose,
      base_url: BASE_MAIN_URL,
      key: PAYSTACK_PUB_KEY,
    });
  } catch (error) {
    next(error);
  }
};
