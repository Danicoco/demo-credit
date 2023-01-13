import {
  IWallet,
  IPaginator,
  ITransaction,
  ILedgerTracker,
  TransactionType,
  TransactionStatus,
} from "../../../types";
import db from "../../../../databases";
import { catchError } from "../../common/utils";
import { Knex } from "knex";

class WalletService {
  private model = (trx?: any) => trx ? trx("wallets") : db("wallets");

  private pinModel = (trx?: any) => trx ? trx("pins") : db("pins");

  private ledgerModel = (trx?: any) => trx ? trx("ledgers") : db("ledgers");

  private transactionModel = (trx?: any) => trx ? trx("transactions") : db("transactions");

  private ledgerTrackerModel = (trx?: any) => trx ? trx("ledgerTrackers") : db("ledgerTrackers");

  private id: string;

  private customerId: string;

  private accountNumber: string;

  constructor(id = "", customerId = "", accountNumber = "") {
    this.id = id;
    this.customerId = customerId;
    this.accountNumber = accountNumber;
  }

  private finder() {
    return {
      ...(this.id && { id: this.id }),
      ...(this.customerId && { customerId: this.customerId }),
      ...(this.accountNumber && { accountNumber: this.accountNumber }),
    };
  }

  private moneySaver(amount: number) {
    return amount.toFixed(2);
  }

  public async create(params: IWallet, trx?: any) {
    const newWallet = await this.model(trx).insert(params).catch((e) => {
      throw e;
    });
    return newWallet;
  }

  public async findOne(): Promise<IWallet> {
    const wallet = await this.model()
      .where(this.finder())
      .first()
      .catch((e) => {
        throw e;
      });
    return wallet;
  }

  public async findAll(params: Partial<IPaginator>) {
    const { limit = 10, page = 1, sort = "createdAt" } = params;
    const wallets = await this.model()
      .where(this.finder())
      .limit(limit)
      .orderBy(sort)
      .offset((page - 1) * limit)
      .catch((e) => {
        throw e;
      });

    return wallets;
  }

  public async update(params: Partial<IWallet>, trx?: Knex.Transaction) {
    const wallet = await this.model(trx)
      .where(this.finder())
      .update(params)
      .catch((e) => {
        throw e;
      });
    return wallet;
  }

  public async findLedgerTracker(
    id = "",
    transactionId = "",
    customerId = "",
    status: TransactionStatus
  ): Promise<ILedgerTracker> {
    const tracker = await this.model()
      .where({
        ...(id && { id }),
        ...(status && { status }),
        ...(customerId && { customerId }),
        ...(transactionId && { transactionId }),
      })
      .first()
      .catch((e) => {
        throw e;
      });
    return tracker;
  }

  public async findTransaction(id = ""): Promise<ITransaction> {
    const transaction = await this.model()
      .where({
        ...(id && { id }),
      })
      .first()
      .catch((e) => {
        throw e;
      });
    return transaction;
  }

  public async balanceHandler(
    type: TransactionType,
    amount: number,
    params: Partial<ITransaction>,
    trx: Knex.Transaction,
    withLedger: boolean,
  ) {
    const { reference, status, description } = params;
    let result;
    const wallet = await this.findOne().catch((e) => {
      throw e;
    });
    if (!wallet)
      throw catchError("Cannot perform operation on invalid wallet", 404);

    if (type === "credit") {
      const balance = this.moneySaver(Number(wallet.balance) + Number(amount));
      const ledgerBalance = this.moneySaver(Number(wallet.ledgerBalance) + Number(amount))
      const trans = await Promise.all([
        this.model(trx)
          .where(this.finder())
          .update({
            balance, lastBalanceUpdateAt: new Date().toISOString(),
            ...(withLedger && {
              ledgerBalance,
              lastLedgerBalanceUpdateAt: new Date().toISOString(),
            })
           }),
        this.transactionModel(trx).insert({
          type,
          status,
          reference,
          description,
          customerId: wallet.customerId,
          currentBalance: wallet.balance,
          amount: this.moneySaver(amount),
          currentLedgerBalance: wallet.ledgerBalance,
        }),
        this.ledgerModel(trx).insert({
          type: "credit",
          source: "customer",
          walletId: wallet.id,
          customerId: wallet.customerId,
          amount: this.moneySaver(amount),
        }),
        this.ledgerModel(trx).insert({
          type: "debit",
          source: "system",
          walletId: wallet.id,
          amount: this.moneySaver(amount),
          customerId: wallet.customerId,
        }),
      ]);

      console.log(trans, "credit wallet");
      await this.ledgerTrackerModel(trx).insert({
        customerId: wallet.customerId,
        // @ts-ignore
        transactionId: trans[1].id,
        type: "credit",
        status: "pending",
      });

      result = trans;
    }

    if (type === "debit") {
      if (Number(wallet.balance) < Number(amount)) {
        throw catchError("Insufficient fund", 400);
      }
      const balance = this.moneySaver(Number(wallet.balance) - Number(amount));
      const trans = await Promise.all([
        this.model(trx).where(this.finder()).update({
          balance,
          lastBalanceUpdateAt: new Date().toISOString(),
        }),
        this.transactionModel(trx).insert({
          type,
          status,
          reference,
          description,
          customerId: wallet.customerId,
          currentBalance: wallet.balance,
          amount: this.moneySaver(amount),
          currentLedgerBalance: wallet.ledgerBalance,
        }),
        this.ledgerModel(trx).insert({
          type: "debit",
          source: "customer",
          walletId: wallet.id,
          customerId: wallet.customerId,
          amount: this.moneySaver(amount),
        }),
        this.ledgerModel(trx).insert({
          type: "credit",
          source: "system",
          walletId: wallet.id,
          customerId: wallet.customerId,
          amount: this.moneySaver(amount),
        }),
      ]);

      console.log(trans, "debit wallet");
      await this.ledgerTrackerModel(trx).insert({
        customerId: wallet.customerId,
        // @ts-ignore
        transactionId: trans[1].id,
        type: "credit",
        status: "pending",
      });

      result = trans;
    }

    return result;
  }

  public async ledgerBalanceHandler(
    type: TransactionType,
    transactionId: string,
    status: TransactionStatus,
    trx: Knex.Transaction
  ) {
    let result;
    const [wallet, tracker, transaction] = await Promise.all([
      this.findOne(),
      this.findLedgerTracker("", transactionId, this.customerId, "pending"),
      this.findTransaction(transactionId),
    ]);
    if (!wallet)
      throw catchError("Cannot perform operation on invalid wallet", 404);
    if (!transaction) throw catchError("Invalid transaction", 400);
    if (!tracker)
      throw catchError("This transaction does not exist on wallet", 400);

    if (transaction.type === "credit" && status === "success") {
      const ledgerBalance = this.moneySaver(
        Number(wallet.ledgerBalance) + Number(transaction.amount)
      );
      const trans = await Promise.all([
        this.model(trx)
          .where({ id: wallet.id })
          .update({
            ledgerBalance,
            lastLedgerBalanceUpdateAt: new Date().toISOString(),
          }),
        this.model(trx).where({ id: tracker.id }).update({ status }),
      ]);

      result = trans;
    }

    if (transaction.type === "debit" && status === "success") {
      const ledgerBalance = this.moneySaver(
        Number(wallet.ledgerBalance) - Number(transaction.amount)
      );
      const trans = await Promise.all([
        this.model(trx)
          .where({ id: wallet.id })
          .update({
            ledgerBalance,
            lastLedgerBalanceUpdateAt: new Date().toISOString(),
          }),
        this.model(trx).where({ id: tracker.id }).update({ status }),
      ]);

      result = trans;
    }

    if (status === "failed") {
      const trans = await Promise.all([
        this.model(trx).where({ id: tracker.id }).update({ status }),
      ]);

      result = trans;
    }

    return result;
  }

  public validateWallet() {

  }
}

export default WalletService;
