import { body } from 'express-validator';

export const createUniversitySchema = [
    body('title')
        .exists()
        .withMessage('University title is required')
        .trim().escape()
        .withMessage('University title name is not valid'),
    body('keyword')
        .exists()
        .withMessage('University keyword is required')
        .trim().escape()
        .withMessage('University keyword is not valid'),
    body('rector')
        .exists()
        .withMessage('Rector name is required')
        .trim().escape()
        .withMessage('Rector name is not valid'),
    body('halls')
        .exists()
        .withMessage('Halls are required'),
        // .isArray()
        // .withMessage('Halls must be of type array and contain only alphabetical characters'),
    body('phone_number')
        .exists()
        .withMessage('Phone Number is required')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
]

export const updateUniversitySchema = [
    body('title')
        .exists()
        .withMessage('University title is required')
        .trim().escape()
        .withMessage('University title name is not valid'),
    body('rector')
        .exists()
        .withMessage('Rector name is required')
        .trim().escape()
        .withMessage('Rector name is not valid'),
    body('halls')
        .exists()
        .withMessage('Halls are required'),
        // .isArray()
        // .withMessage('Halls must be of type array and contain only alphabetical characters'),
    body('phone_number')
        .exists()
        .withMessage('Phone Number is required')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
]
