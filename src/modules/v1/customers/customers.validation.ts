import { body } from "express-validator";

export const basicUserRule = () => [
    body('email').isEmail().withMessage('Enter your email').notEmpty(),
    body('password')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage('Password must have at least 1 lowercase, 1 number, 1 special characters and 8 characters long')
    .notEmpty(),
];

export const createAccountRule = () => [
    body('city').isString().withMessage('Enter your city').notEmpty(),
    body('state').isString().withMessage('Enter your state').notEmpty(),
    body('address').isString().withMessage('Enter your Address').notEmpty(),
    body('lastName').isString().withMessage('Enter your Last Name').notEmpty(),
    body('firstName').isString().withMessage('Enter your Last Name').notEmpty(),
    body('phoneNumber').isString().withMessage('Enter your Last Name').notEmpty(),
    ...basicUserRule(),
];

export const loginRule = () => [
    ...basicUserRule(),
]
