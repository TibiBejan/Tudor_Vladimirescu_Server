import { body }  from 'express-validator';

export const createUserSchema = [
    body('first_name')
        .exists()
        .withMessage('First name is required')
        .isAlpha()
        .withMessage('First name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long')
        .trim().escape()
        .withMessage('First name is not valid'),
    body('last_name')
        .exists()
        .withMessage('Last name is required')
        .isAlpha()
        .withMessage('Last name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long')
        .trim().escape()
        .withMessage('Last name is not valid'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('password_confirm')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords does not match'),
    body('role')
        .optional()
        .isIn(['admin', 'student'])
        .withMessage('Invalid Role type'),
]

export const updateUserSchema = [
    body('first_name')
        .optional()
        .isAlpha()
        .withMessage('First name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long')
        .trim().escape()
        .withMessage('First name is not valid'),
    body('last_name')
        .optional()
        .isAlpha()
        .withMessage('Last name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long')
        .trim().escape()
        .withMessage('Last name is not valid'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('role')
        .optional()
        .isIn(['admin', 'student'])
        .withMessage('Invalid Role type'),
]
