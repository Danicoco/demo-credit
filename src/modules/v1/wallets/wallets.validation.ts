import { body, query } from 'express-validator';

const basicPinRule = (name = '') => [
    body(name || 'pin').isNumeric().withMessage('Pin must numeric').isLength({ min: 4, max: 4 }).withMessage('Pin must be 4 numbers').notEmpty().withMessage('Enter a valid pin'),
];

const basicAmountRule = () => [
    body('amount').isNumeric().withMessage('Enter a valid amount').notEmpty(),
]

const basicAccountRule = () => [
    body('accountNumber').isString().withMessage('Enter a valid account number').isLength({ min: 10, max: 10 }).notEmpty(),
]

export const validatePin = (isChange = false) => [
    ...basicPinRule(),
    ...(isChange ? basicPinRule('oldPin') : [])
];

export const validateWithdrawFund = () => [
    ...basicPinRule(),
    ...basicAmountRule(),
];

export const validateFundAccount = () => [
    body('reference').isString().withMessage('Enter a valid reference').notEmpty(),
];

export const validateTransferAccount = () => [
    ...basicPinRule(),
    ...basicAmountRule(),
    ...basicAccountRule(),
    body('note').isString().withMessage('Enter transaction note').notEmpty()
];

export const validateAccountResolver = () => [
    ...basicAccountRule(),
];

export const validatePaymentInterface = () => [
    query('purpose').isIn(['tokenization', 'payment']).withMessage('Invalid payment purpose').notEmpty(),
    query('customerId').isString().withMessage('Invalid customer').notEmpty(),
    query('amount').isNumeric().withMessage('Enter a valid amount').optional(),
];
