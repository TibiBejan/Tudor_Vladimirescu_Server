import { body } from 'express-validator';

export const createEnrollmentSchema = [
    body('university')
        .exists()
        .withMessage('University is required')
        .trim().escape()
        .withMessage('University is not valid'),
    body('year_of_study')
        .exists()
        .withMessage('Year of study is required')
        .isNumeric()
        .withMessage('Year of study must be numeric')
        .trim().escape()
        .withMessage('Year of study is not valid'),
    body('type_of_study')
        .exists()
        .withMessage('Study type is required')
        .isAlpha()
        .withMessage('Study type must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Study type is not valid'),
    body('grade')
        .exists()
        .withMessage('Grade is required')
        .isFloat()
        .withMessage('Grade must be numeric, decimal point')
        .trim().escape()
        .withMessage('Grade is not valid, please try again!'),
    body('financial_type')
        .exists()
        .withMessage('Financial type is required')
        .isAlpha()
        .withMessage('Financial type must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Financial type is not valid'),
    body('nationality')
        .exists()
        .withMessage('Nationality is required')
        .isAlpha()
        .withMessage('Nationality must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Nationality is not valid'),
     body('student_gender')
        .exists()
        .withMessage('Gender is required')
        .isAlpha()
        .withMessage('Gender must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Gender is not valid'),    
]

export const updateEnrollmentSchema = [
    body('university')
        .trim().escape(),
    body('year_of_study')
        .isNumeric()
        .withMessage('Year of study must be numeric')
        .trim().escape()
        .withMessage('Year of study is not valid'),
    body('type_of_study')
        .isAlpha()
        .withMessage('Study type must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Study type is not valid'),
    body('grade')
        .isFloat()
        .withMessage('Grade must be numeric, decimal point')
        .trim().escape()
        .withMessage('Grade is not valid, please try again!'),
    body('financial_type')
        .isAlpha()
        .withMessage('Financial type must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Financial type is not valid'),
    body('nationality')
        .isAlpha()
        .withMessage('Nationality must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Nationality is not valid'),
     body('student_gender')
        .isAlpha()
        .withMessage('Gender must contain only alphabetical characters')
        .trim().escape()
        .withMessage('Gender is not valid'),    
]
