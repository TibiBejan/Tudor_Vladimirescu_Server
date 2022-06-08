import httpStatus from "http-status";
import bcrypt from 'bcrypt';
import dbModels from '../models';
import AppError from '../utils/appError';
import createToken from '../utils/token';
import { filterObjectEntries, customOrder } from '../utils/utilityFunctions';
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
            data: user
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
            data: newEnrollment
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
            data: currentEnrollment
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
            data: currentEnrollment
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
    try {
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
        // Fetch all halls data based on university halls array
        const universityHalls = await Hall.findAll({
            where: {
                hall_name: halls
            },
            order: [['min_grade', 'desc']],
            attributes: ['id', 'hall_number', 'hall_name', 'total_rooms', 'total_students', 'students_in_room', 'min_grade', 'max_grade']
        });
        for (const [index, hall] of universityHalls.entries()) {
            const studentsLimit = hall.total_students;
            const roomsLimit = hall.total_rooms;
            // Get all students with current hall id
            const totalStudentsFromHall = await User.count({
                where: { hallId: hall.id }
            });
            // Validate the current hall students number - related to accommodated users in all university halls
            if(totalStudentsFromHall > studentsLimit && index === universityHalls.length - 1) {
                return next(new AppError("You can not enroll because the limit of students for your university has been reached.", 500));
            }
            // Validate the current hall students number - related to accommodated users in current university hall
            if(totalStudentsFromHall >= studentsLimit) {
                continue; // skip to next hall from current university
            }
            // Check if curent student grade validate hall constraints
            if(enrollment.grade < hall.min_grade || enrollment.grade > hall.max_grade) {
                continue; 
            }
            // If there are available spaces in current hall and grade match, enroll student
            req.user.hallId = hall.id;
            await req.user.save();

            // Fetch current user data including Enrollment, using req.user.id
            const currentUserToAccommodate = await User.findOne({
                where: {id: req.user.id},
                include: [{
                    model: Enrollment,
                }]
            });

            // Set room rent price hardcoded
            let rent = 0;
            if(hall.students_in_room === 2) {
                rent = 250;
            } else if (hall.students_in_room === 3) {
                rent = 200;
            } else {
                rent = 150;
            }

            // Map all hall rooms
            for(let i = 0; i <= roomsLimit; i++) {
                // Set room floor hardcoded
                let floor = 0;
                if(i > 70 && i < 140) {
                    floor = 1;
                } else if (i > 140 && i < 210) {
                    floor = 2;
                } else if (i > 210 && i < 280) {
                    floor = 3
                }
                // Check if student is already allocated
                const currentAllocatedStudent = await HallRoom.findOne({where: {hallId: hall.id, userId: currentUserToAccommodate.id}});
                if(currentAllocatedStudent) {
                    return res.status(500).json({
                        status: httpStatus[500],
                        message: `You are already allocated in Hall ${hall.hall_name}`,
                    });
                };
                // Fetch students from room with index i
                const currentRoomMembers = await HallRoom.findAll({where: {hallId: hall.id, number: i}});
                // If the room is full, increment room number
                if(currentRoomMembers.length >= hall.students_in_room) {
                    continue;
                }
                // If room is empty, accommodate student
                if(currentRoomMembers.length === 0) {
                    const allocateStudentToRoom = await HallRoom.create({
                        number: i,
                        floor: floor,
                        rent_per_month: rent,
                        beds_number: hall.students_in_room,
                        bathroom: hall.bathroom,
                        hallId: currentUserToAccommodate.hallId,
                        userId: currentUserToAccommodate.id
                    });

                    return res.status(200).json({
                        status: "success",
                        message: "Student has been allocated!"
                    });
                }
                // If room has free beds, accommodate student
                if(currentRoomMembers.length < hall.students_in_room) {
                    // Get already accommodated students from this room
                    const existingStudentsInRoom = await HallRoom.findAll({
                        where: {
                            hallId: hall.id,
                            room_number: i
                        },
                        include: [{
                            model: User,
                            include: Enrollment
                        }],
                    });
                    let isMatch = false;
                    if(existingStudentsInRoom) {
                        existingStudentsInRoom.forEach((s) => {
                            if(s.User.Enrollment.student_gender === currentUserToAccommodate.Enrollment.student_gender) {
                                isMatch = true;
                            } else {
                                isMatch = false;
                            }
                        });

                        if(isMatch) {
                            const allocateStudentToRoom = await HallRoom.create({
                                number: i,
                                floor: floor,
                                rent_per_month: rent,
                                beds_number: hall.students_in_room,
                                bathroom: hall.bathroom,
                                hallId: currentUserToAccommodate.hallId,
                                userId: currentUserToAccommodate.id
                            });
        
                            return res.status(200).json({
                                status: "success",
                                message: "Student has been allocated!"
                            });
                        }

                        if(!isMatch) { 
                            continue;
                        }
                    } 
                }
            }
        }
    }
    catch(err) {
        return res.status(400).json({
            status: err.name,
            message: `${err.message} at ${err.expiredAt}`
        }); 
    }
}