import axios from "axios";
import { catchError } from "./utils";

const { BASEURL, PAYSTACK_SECRET } = process.env;

if (typeof BASEURL !== "string") {
    throw catchError('Paystack details not in env');
}

class Paystack {
    private conn = axios.create({
        baseURL: BASEURL,
        headers: {
          common: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
          },
        },
      });

    private reference: string;

    constructor(reference = '') {
        this.reference = reference;
    }

    public async verifyTransaction() {
        const verify = await this.conn
          .get(`/transaction/verify/${this.reference}`)
          .then(({ data }) => data)
          .catch(() => {
            throw catchError('Failed to verify transaction', 400);
          });

        if (verify.status) {
          return verify.data;
        }

        throw catchError('Failed to verify transaction', 400);
      }

      public async verifyAccountDetails(accNumber: string, code: string) {
        const trf = await this.conn
          .get(`/bank/resolve?account_number=${accNumber}&bank_code=${code}`)
          .then(({ data }) => data)
          .catch((e) => {
            throw catchError(e, 400);
          });

        if (trf.status) {
          return trf.data;
        }

        throw catchError('Failed to verify account', 400);
      }

      public async getBankList() {
        const banks = await this.conn
          .get('/bank')
          .then(({ data }) => data)
          .catch(() => {
            throw catchError('Failed to get bank list', 400);
          });

        if (banks.status) {
          return banks.data;
        }

        throw catchError('Failed to get bank list', 400);
      }
}

export default Paystack;
