import { body } from 'express-validator';

export const updatePwdSchema = [
    body('password_confirm')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('password_new')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('password_new_confirm')
        .exists()
        .custom((value, { req }) => value === req.body.password_new)
        .withMessage('Passwords does not match'),
]

export const updateMe = [
    body('first_name')
        .optional()
        .isAlpha()
        .withMessage('First name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('First name must contain at least 3 characters long')
        .trim().escape()
        .withMessage('First name is not valid'),
    body('last_name')
        .optional() 
        .isAlpha()
        .withMessage('Last name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('Last name must contain at least 3 characters long')
        .trim().escape()
        .withMessage('Last name is not valid'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email is not valid')
        .normalizeEmail(),
]