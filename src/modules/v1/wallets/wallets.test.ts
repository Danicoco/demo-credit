import request from "supertest";
import { randomInt, randomBytes } from 'crypto';
import server from "../../../server";

const customerBaseURL = "/v1/customers";
const walletBaseURL = "/v1/wallets";

const customerPassword = "ui32@Kdsa";
const customerEmail = "richardjohn740@gmail.com";

// get wallet
describe("Authorized Customer Wallet", () => {
    // with valid customer id
    let token = '';
    beforeEach(async () => {
        const response = await request(server).post(`${customerBaseURL}/login`).send({
            email: customerEmail,
            password: customerPassword
        });

        token = response.body.meta.token;
    });
    describe("Create or get customer wallet", () => {
        test("return valid wallet details", async () => {
            const response = await request(server).get(`${walletBaseURL}`).set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        })
        test("wallet returns valid balance", async () => {
            const response = await request(server).get(`${walletBaseURL}`).set('Authorization', `Bearer ${token}`);
            expect(response.body.data.balance).toBeGreaterThanOrEqual(0);
        });
        test("wallet returns valid balance", async () => {
            const response = await request(server).get(`${walletBaseURL}`);
            expect(response.statusCode).toBe(401);
        });
    });

    describe('Get bank lists', () => {
        test("retrieve bank lists", async () => {
            const response = await request(server).get(`${walletBaseURL}/banks`).set('Authorization', `Bearer ${token}`);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.statusCode).toBe(200);
        })
    });

    describe("create pin", () => {
        test("should return error for existing user", async () => {
            const response = await request(server).post(`${walletBaseURL}/pins`)
                .send({
                    pin: '1234'
                })
                .set('Authorization', `Bearer ${token}`);
            expect(response.body.message).toEqual("You already created your pin");
            expect(response.statusCode).toBe(400);
        })

        test("should fail for using invalid pin", async () => {
            const response = await request(server).post(`${walletBaseURL}/pins`)
                .send({
                    pin: '123'
                })
                .set('Authorization', `Bearer ${token}`);
            expect(response.body.message).toEqual("Pin must be 4 numbers");
            expect(response.statusCode).toBe(400);
        })
    })

    describe("resolve account", () => {
        test("resolve existing account successfully", async () => {
            const response = await request(server).post(`${walletBaseURL}/resolve-account`)
            .send({
                accountNumber: '2303182782'
            })
            .set('Authorization', `Bearer ${token}`);
            expect(response.body.data.accountNumber).toBe('2303182782');
            expect(response.statusCode).toBe(200);
        })
    });
});
