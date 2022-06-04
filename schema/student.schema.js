import { body } from 'express-validator';

export const createStudentMetaSchema = [
    body('username')
        .exists()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must contain at least 3 characters long')
        .trim().escape()
        .withMessage('Username is not valid'),
    body('dob')
        .exists()
        .withMessage('Your date of birth is required')
        .isISO8601()
        .withMessage('Your date must have a valid date format')
        .trim().escape()
        .withMessage('Your date of birth is not valid'),
    body('gender')
        .exists()
        .withMessage('You must specify your gender')
        .isAlpha()
        .withMessage('Your gender field must contain only letters')
        .trim().escape(),
    body('nationality')
        .exists()
        .withMessage('You must specify your nationality')
        .isAlpha()
        .withMessage('Your nationality field must contain only letters')
        .trim().escape(),
    body('phone_number')
        .exists()
        .withMessage('Phone Number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric.')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
    body('street_adress')
        .exists()
        .withMessage('Adress is required')
        .trim().escape(),
    body('city')
        .exists()
        .withMessage('You must specify your city')
        .isAlpha()
        .withMessage('Your city field must contain only letters')
        .trim().escape(),
    body('state')
        .exists()
        .withMessage('You must specify your state')
        .isAlphanumeric()
        .withMessage('Your state or province field must contain only alphanumeric characters')
        .trim().escape(),
    body('country')
        .exists()
        .withMessage('You must specify your country')
        .isAlpha()
        .withMessage('Your country field must contain only letters')
        .trim().escape(),
    body('zip_code')
        .exists()
        .withMessage('You must specify your zip code')
        .trim().escape(),
]

export const updateStudentMetaSchema = [
    body('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Username must contain at least 3 characters long')
        .trim().escape()
        .withMessage('Username is not valid'),
    body('dob')
        .optional()
        .isISO8601()
        .withMessage('Must be a valid date format')
        .trim().escape()
        .withMessage('Your date of birth is not valid'),
    body('gender')
        .optional()
        .isAlpha()
        .withMessage('Your gender field must contain only letters')
        .trim().escape(),
    body('nationality')
        .optional()
        .isAlpha()
        .withMessage('Your nationality field must contain only letters')
        .trim().escape(),
    body('phone_number')
        .optional()
        .isNumeric()
        .withMessage('Phone number must be numeric.')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
    body('street_adress')
        .optional()
        .trim().escape(),
    body('city')
        .optional()
        .isAlpha()
        .withMessage('Your city field must contain only letters')
        .trim().escape(),
    body('state')
        .optional()
        .isAlphanumeric()
        .withMessage('Your state or province field must contain only alphanumeric characters')
        .trim().escape(),
    body('country')
        .optional()
        .isAlpha()
        .withMessage('Your country field must contain only letters')
        .trim().escape(),
    body('zip_code')
        .optional()
        .trim().escape(),
]
