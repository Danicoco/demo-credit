import { body, oneOf, query } from "express-validator";

export const basicUserRule = () => [
    body('email').isEmail().withMessage('Enter a valid email').notEmpty(),
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
    body('firstName').isString().withMessage('Enter your First Name').notEmpty(),
    body('phoneNumber').isMobilePhone("en-NG").withMessage('Enter a valid phone number').notEmpty(),
    ...basicUserRule(),
];

export const loginRule = () => [
    ...basicUserRule(),
];

export const profileRule = () => [
    oneOf([
        query('id').isNumeric().withMessage('Enter a valid id').exists(),
        query('email').isEmail().withMessage('Enter a valid email address').exists(),
    ])
];
