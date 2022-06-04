import { body } from 'express-validator';

export const createRelativesSchema = [
    body('first_name')
        .exists()
        .withMessage('First name is required')
        .isAlpha()
        .withMessage('First name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('First name must contain at least 3 characters long')
        .trim().escape()
        .withMessage('First name is not valid'),
    body('last_name')
        .exists()
        .withMessage('Your last name is required')
        .isAlpha()
        .withMessage('Last name must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('Last name must contain at least 3 characters long')
        .trim().escape()
        .withMessage('Last name is not valid'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('relation')
        .exists()
        .withMessage('Relation is required')
        .isAlpha()
        .withMessage('Relation must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('Relation must be at least 3 characters long')
        .trim().escape()
        .withMessage('Kin is not valid, please try again!'),
    body('adress')
        .exists()
        .withMessage('Adress is required')
        .trim().escape(),
    body('phone_number')
        .exists()
        .withMessage('Phone Number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric.')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
]

export const updateRelativesSchema = [
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
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('relation')
        .optional()
        .isAlpha()
        .withMessage('Relation must contain only alphabetical characters')
        .isLength({ min: 3 })
        .withMessage('Relation must be at least 3 characters long')
        .trim().escape()
        .withMessage('Kin is not valid, please try again!'),
    body('adress')
        .optional()
        .trim().escape(),
    body('phone_number')
        .optional()
        .isNumeric()
        .withMessage('Phone number must be numeric.')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
]