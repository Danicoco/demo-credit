import request from "supertest";
import { randomInt, randomBytes } from 'crypto';
import server from "../../../server";

const customerBaseURL = "/v1/customers";

const customerId = "1";
const customerPassword = "ui32@Kdsa";
const customerEmail = "richardjohn740@gmail.com";

// create account
describe("Create New Account", () => {
    // success
    let newCustomerCredential =  {
        city: "Lagos Island",
        state: "Lagos",
        address: "32, Princess street",
        lastName: "Aderemi",
        firstName: "Dare",
        phoneNumber: `081${randomInt(10000000,99999999)}`,
        email: `${randomBytes(10).toString('hex')}@gmail.com`,
        password: "ui32@Kdsa"
    }
    describe("when correctly formatted credentials are passed", () =>  {
        // valid and new credentials are passed
        newCustomerCredential = {
            ...newCustomerCredential,
            email: `${randomBytes(10).toString('hex')}@gmail.com`,
            password: "ui32@Kdsa"
        }
        test("should respond with valid email and status", async () => {
            const  response = await request(server).post(`${customerBaseURL}/create-account`).send(newCustomerCredential);
            expect(response.statusCode).toBe(201);
            expect(response.body.data.email).toEqual(newCustomerCredential.email);
        })
    })
    // fail
    describe("when wrong credentials are passed", () => {
        // existing email and password
        test("fails due to exisiting credentials and status 400", async () => {
            newCustomerCredential = {
                ...newCustomerCredential,
                email: customerEmail,
                password: customerPassword
            }
            const response = await request(server).post(`${customerBaseURL}/create-account`).send(newCustomerCredential);
            expect(response.body.message).toEqual('You already have an account. Proceed to login');
            expect(response.statusCode).toBe(403);
        });

        // invalid email
        test("fails due to invalid email", async () => {
            newCustomerCredential  = {
                ...newCustomerCredential,
                email: 'james.com'
            }
            const response = await request(server).post(`${customerBaseURL}/create-account`).send(newCustomerCredential);
            expect(response.body.message).toEqual('Enter a valid email');
            expect(response.statusCode).toBe(400);
        });
    })
})

// get profile
describe("Get Customer Profile", () => {
  // pass test
  describe("given either email or customer id is passed", () => {
    test("should respond with status code of 200", async () => {
      const response = await request(server).get(
        `${customerBaseURL}/profile?id=${customerId}`
      );
      expect(response.statusCode).toBe(200);
    });

    test("response should include customer email", async () => {
      const response = await request(server).get(
        `${customerBaseURL}/profile?id=${customerId}`
      );
      expect(response.body.data.email).toBe(customerEmail);
    });
  });

  // fail test
  describe("when both email or id is passed", () => {
    test("should return 400 status code", async () => {
      const response = await request(server).get(`${customerBaseURL}/profile}`);
      expect(response.statusCode).toBe(200);
    });
  });
});

// login
describe("Customer Login", () => {
  // pass test
  describe("when correct credentials are passed", () => {
    // status code
    test("should respond with 200 status code", async () => {
      const response = await request(server)
        .post(`${customerBaseURL}/login`)
        .send({
          email: customerEmail,
          password: customerPassword,
        });
      expect(response.statusCode).toBe(200);
    });
    // token check
    test("should return authentication token", async () => {
      const response = await request(server)
        .post(`${customerBaseURL}/login`)
        .send({
          email: customerEmail,
          password: customerPassword,
        });
      expect(response.body.meta.token).toBeDefined();
    });
    // email check
    test("should return same login email", async () => {
      const response = await request(server)
        .post(`${customerBaseURL}/login`)
        .send({
          email: customerEmail,
          password: customerPassword,
        });
      expect(response.body.data.email).toBe(customerEmail);
    });
  });
  // fail test
  describe("when incorrect credentials are passed", () => {
    // status check - wrong credential
    test("should return 400 status code for wrong passwrod", async () => {
      const response = await request(server)
        .post(`${customerBaseURL}/login`)
        .send({
          email: customerEmail,
          password: "123456",
        });
      expect(response.statusCode).toBe(400);
    });
    // validation check - invalid email
    test("should return validation error for wrong email", async () => {
      const response = await request(server)
        .post(`${customerBaseURL}/login`)
        .send({
          email: "richard.com",
          password: "123456",
        });
      expect(response.statusCode).toBe(400);
    });
    // validation check - incorrect password
    test("should return incorrect password for wrong password", async () => {
      const response = await request(server)
        .post(`${customerBaseURL}/login`)
        .send({
          email: customerEmail,
          password: "123456",
        });
      expect(response.body.message).toBe(
        "Password must have at least 1 lowercase, 1 number, 1 special characters and 8 characters long"
      );
    });
  });
});
