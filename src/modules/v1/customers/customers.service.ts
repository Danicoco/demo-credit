import db from "../../../../databases";
import { ICustomer, IPaginator } from "../../../types";
import { Knex } from 'knex';

class CustomerService {
  private model = (trx?: Knex.Transaction) => trx ? trx("customers") : db("customers");
  private model1 = db("customers");

  private id: string;

  private email: string;

  private phoneNumber: string;

  constructor(id = "", email = "", phoneNumber = "") {
    this.id = id;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  private finder() {
    return {
      ...(this.id && { id: this.id }),
      ...(this.email && { email: this.email }),
      ...(this.phoneNumber && { phoneNumber: this.phoneNumber }),
    };
  }

  public async create(params: ICustomer, trx?: Knex.Transaction) {
    const newCustomer = await this.model(trx)
      .insert(params)
      .catch((e) => {
        throw e;
      });
    return newCustomer;
  }

  public async findOne(): Promise<ICustomer> {
    const customer = await this.model1
      .where(this.finder())
      .first()
      .catch((e) => {
        throw e;
      });
    return customer;
  }

  public async findAll(params: Partial<IPaginator>) {
    const { limit = 10, page = 1, sort = "createdAt" } = params;
    const customers = await this.model()
      .where(this.finder())
      .limit(limit)
      .orderBy(sort)
      .offset((page - 1) * limit)
      .catch((e) => {
        throw e;
      });

    return customers;
  }

  public async update(params: Partial<ICustomer>, trx: Knex.Transaction) {
    const customer = await this.model(trx)
      .where(this.finder())
      .update(params)
      .catch((e) => {
        throw e;
      });
    return customer;
  }

  public get(c: ICustomer) {
    const keys = ['password', 'isActive', 'updated_at'];
    keys.map(item => delete c[item]);

    return c;
  }
}

export default CustomerService;
