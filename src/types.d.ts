import { Request } from 'express';

interface DefaultAttributes {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

interface ICustomer extends DefaultAttributes {
  city: string;
  email: string;
  state: string;
  address: string;
  lastName: string;
  password: string;
  isActive?: boolean;
  firstName: string;
  phoneNumber: string;
}

interface IWallet extends DefaultAttributes {
  pin?: string;
  balance: string;
  customerId: string;
  accountName: string;
  pinChangedAt?: Date;
  accountNumber: string;
  ledgerBalance: string;
  lastBalanceUpdateAt: Date;
  lastLedgerBalanceUpdateAt: Date;
}

interface ILedger extends DefaultAttributes {
  amount: number;
  source: ISource;
  walletId: string;
  customerId: string;
  type: TransactionType;
}

interface ITransaction extends DefaultAttributes {
  amount: string;
  walletId: string;
  reference: string;
  customerId: string;
  description: string;
  type: TransactionType;
  currentBalance: string;
  status: TransactionStatus;
  currentLedgerBalance: string;
}

interface ILedgerTracker extends DefaultAttributes {
  customerId: string;
  transactionId: string;
  type: TransactionType;
  status: TransactionStatus;
}

interface IPaginator {
  page: number;
  sort: string;
  limit: number;
  filter: string;
}

type TransactionType = 'credit' | 'debit';
type ISource = 'customer' | 'system';
type TransactionStatus = 'success' | 'pending' | 'failed';

type CreateErr = (message: string, code?: number, validations?: object) => Error;

type AppError = Error & {
  code: number;
  name?: string;
  message: string;
  validations?: object | null;
};

declare module "express-serve-static-core" {
  export interface Request {
    user: ICustomer;
  }
}


type Fix = any;
