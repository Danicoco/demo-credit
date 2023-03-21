import { Request, Response, NextFunction } from "express";
import { randomInt } from "crypto";
import { format } from "date-fns";
import db from "../../../../databases";

import CustomerService from "./customers.service";
import { hashPassword, matchPassword } from "../../common/hashes";
import { authenticate, catchError, success } from "../../common/utils";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    city,
    state,
    email,
    address,
    lastName,
    password,
    firstName,
    phoneNumber,
  } = req.body;
  try {
    const emailService = new CustomerService("", email);
    const phoneService = new CustomerService("", "", phoneNumber);
    const [emailExist, phoneNumberExist] = await Promise.all([
      emailService.findOne(),
      phoneService.findOne(),
    ]).catch(() => {
      throw catchError("An error occured!");
    });

    if (emailExist)
      throw catchError("You already have an account. Proceed to login");
    if (phoneNumberExist)
      throw catchError("You already have an account. Proceed to login");

    const customer = await emailService
      .create({
        city,
        state,
        email,
        address,
        lastName,
        firstName,
        phoneNumber,
        password: hashPassword(password),
      })
      .catch(() => {
        throw catchError("Error creating your account", 500);
      });

    const retrievedCustomer = await new CustomerService(
      String(customer[0])
    ).findOne();

    return res
      .status(201)
      .json(
        success(
          "Account created successfully",
          phoneService.get(retrievedCustomer)
        )
      );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const customer = await new CustomerService("", email).findOne();

    if (!customer)
      throw catchError("You don't have an account. Register to continue");

    if (!matchPassword(password, customer.password))
      throw catchError("Email/password is incorrect");

    const token = authenticate({ id: customer.id, email: customer.email });
    delete customer.password;

    return res
      .status(200)
      .json(success("Login successfully", customer, { token }));
  } catch (error) {
    next(error);
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, id } = req.query;
  try {
    const service = new CustomerService(id as string, email as string);
    const customer = await service.findOne();

    return res
      .status(200)
      .json(success("Profile complte", customer ? service.get(customer) : null));
  } catch (error) {
    next(error);
  }
};
