import httpStatus from "http-status";
import bcrypt from 'bcrypt';
import dbModels from '../models';
import AppError from '../utils/appError';
import createToken from '../utils/token';
import { filterObjectEntries } from '../utils/utilityFunctions';
import {config} from 'dotenv';
config();

// Extract models from db export
const { User, University, Enrollment, StudentMeta, Relatives, Hall, HallRoom } = dbModels;


export const updateProfile = async (req, res, next) => {
    // CREATE ERROR IF USER POST'S PASSWORD DATA
    if(req.body.password) {
        return next(new AppError("You can not use this route to update your password. Use update password route.", 400));
    }
    // FILTER BODY AND UPDATE SPECIFIC FIELDS
    const filteredBody = filterObjectEntries(req.body, 'first_name', 'last_name', 'email');
    try {
        const updatedUser = await User.update(filteredBody, {where: { id: req.user.id }});
        const user = await User.findOne({where: { id: req.user.id }});
        // JSON RESPONSE WITH UPDATED USER
        return res.status(200).json({
            status: "Success",
            message: "User has been updated!",
            user: user
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad Request",
            message: "There is an error updating your info, please try again..."
        });
    }
}

export const deleteProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({where: { id: req.user.id}});
        if(!user) {
            return next(new AppError("User not found", 404));
        }
        await user.destroy();
        return res.status(204).json({
            status: "success",
            message: "User has been deleted!"
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findOne({where: { id: req.user.id }});
        if(!user) {
            return next(new AppError("The user belonging to this token does no longer exists.", 401));
        }
        // CHECK IF POSTED PASSWORD IS CORRECT
        // HASH PASSWORD
        const salt = await bcrypt.genSalt(12);
        const hashedPasswordNew = await bcrypt.hash(req.body.password_new, salt);

        if(!await user.checkPwdValidation(req.body.password_confirm, user.password)) {
            return next(new AppError("Your current password is wrong.", 401));
        }
        // UPDATE PASSWORD
        user.password = hashedPasswordNew;
        user.password_changed_at = new Date(Date.now()).toUTCString();
        await user.save();
        // LOG IN THE USER WITH THE NEW JWT
        createToken(user, 200, "Password updated!", res);
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again...",
        });
    }
}

export const createEnrollment = async (req, res, next) => {
    try {
        // GET DATA FROM REQ
        let { university, year_of_study, type_of_study, grade, financial_type, nationality, student_gender } = req.body;
        // GET UNIVERSITY BASED ON ENROLLMENT
        const studentUniversity = await University.findOne({ where: { title: university } });
        if(!studentUniversity) {
            return next(new AppError("The enrollment can not be done, please try again", 400));
        }
        // CHECK IF STUDENT IS ALREADY ENROLLED
        const isEnrolled = await Enrollment.findOne({ where: { universityId: studentUniversity.id, userId: req.user.id } });
        if(isEnrolled) {
            return next(new AppError("You are already enrolled, please try to update current enrollment.", 406));
        }
        const newEnrollment = await Enrollment.create({
            university: university,
            year_of_study: year_of_study,
            type_of_study: type_of_study,
            grade: grade,
            financial_type: financial_type,
            nationality: nationality,
            student_gender: student_gender,
            userId: req.user.id,
            universityId: studentUniversity.id
        });
        return res.status(200).json({
            status: "Success",
            message: "Enrollment has been created!",
            enrollment: newEnrollment
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again....",
        }); 
    }
}

export const getEnrollment = async (req, res, next) => {
    try {
        const currentEnrollment = await Enrollment.findOne({ where: { userId: req.user.id } });
        if(!currentEnrollment) {
            return next(new AppError("Enrollment not found, please enroll", 404));
        }
        // JSON RESPONSE WITH UPDATED USER
        return res.status(200).json({
            status: "Success",
            message: "Enrollment found!",
            enrollment: currentEnrollment
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again....",
        }); 
    }
}

export const updateEnrollemnt = async (req, res, next) => {
    try {
        const currentEnrollment = await Enrollment.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if(!currentEnrollment) {
            return next(new AppError("Enrollment not found, please enroll", 404));
        }
        // FILTER BODY AND UPDATE SPECIFIC FIELDS
        const filteredBody = filterObjectEntries(req.body, 'university', 'year_of_study', 'type_of_study', 'grade', 'financial_type', 'nationality', 'student_gender');
        // UPDATE ENROLLMENT
        const studentUniversity = await University.findOne({ where: { title: req.body.university } });
        if(!studentUniversity) {
            return next(new AppError("The enrollment can not be updated, please try again", 400));
        }
        await currentEnrollment.update({
            ...filteredBody,
            universityId: studentUniversity.id
        });

        // JSON RESPONSE WITH UPDATED USER
        return res.status(200).json({
            status: "Success",
            message: "Enrollment has been updated!",
            enrollment: currentEnrollment
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again....",
        }); 
    }
}

export const deleteEnrollment = async (req, res, next) => {
    try{
        // FIND AND CHECK ENROLLMENT
        const currentEnrollment = await Enrollment.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if(!currentEnrollment) {
            return next(new AppError("Enrollment not found, please enroll", 404));
        }
        await currentEnrollment.destroy();
        return res.status(204).json({
            status: "success",
            message: "Enrollment has been deleted!"
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again....",
        }); 
    }
}

export const allocateStudent = async (req, res, next) => {
    // Check for student meta updated
    const studentMetaExists = await StudentMeta.findOne({where: {userId: req.user.id}});
    if(!studentMetaExists) {
        return next(new AppError("In order to be allocated, you must update your student informations.", 404));
    }
    // Check for student relatives
    const studentKinsExists = await Relatives.findAll({where: {id: req.user.id}});
    if(!studentKinsExists) {
        return next(new AppError("In order to be allocated, you must update your student informations.", 404));
    }
    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({where: {userId: req.user.id}});
    if(!enrollment) {
        return next(new AppError("In order to be allocated, you must enroll.", 404));
    }
    // Get all university halls based enrollment university id
    const {halls} = await University.findOne({
        where: { id: enrollment.universityId },
        attributes:['halls']
    });

    console.log(halls)

    return res.status(204).json({
        status: "success",
        message: "Student has been allocated!"
    });
}