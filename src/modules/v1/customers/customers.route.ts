import { Router } from "express";
import { isAuthenticated, validate } from "../../common/utils";
import { createAccountRule, loginRule } from "./customers.validation";
import { createAccount, login, profile } from "./customers.controller";

const customerRouters = Router();

customerRouters.post(
  "/create-account",
  createAccountRule(),
  validate,
  createAccount
);
customerRouters.get("/profile", isAuthenticated, profile);
customerRouters.post("/login", loginRule(), validate, login);

export default customerRouters;
