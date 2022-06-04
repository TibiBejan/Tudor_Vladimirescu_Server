import { body } from 'express-validator';

export const createHallStaffSchema = [
    body('hallId')
        .exists()
        .withMessage('HallId is required')
        .trim().escape()
        .withMessage('HallId is not valid'),
    body('name')
        .exists()
        .withMessage('Name is required')
        .trim().escape()
        .withMessage('Name is not valid'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email adress')
        .trim().escape()
        .withMessage('Email is not valid'),
    body('position')
        .exists()
        .withMessage('Position is required')
        .trim().escape()
        .withMessage('Position is not valid'),
    body('phone_number')
        .exists()
        .withMessage('Phone Number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric.')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
]

export const updateHallStaffSchema = [
    body('hallId')
        .exists()
        .withMessage('Hall Id is required')
        .trim().escape()
        .withMessage('Hall Id is not valid'),
    body('name')
        .exists()
        .withMessage('Name is required')
        .trim().escape()
        .withMessage('Name is not valid'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email adress')
        .trim().escape()
        .withMessage('Email is not valid'),
    body('position')
        .exists()
        .withMessage('Position is required')
        .trim().escape()
        .withMessage('Position is not valid'),
    body('phone_number')
        .exists()
        .withMessage('Phone Number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric.')
        .isMobilePhone()
        .withMessage('This phone number is not valid, please try again.')
        .trim().escape(),
]
