import dbModels from '../models';
import AppError from '../utils/appError';
import { filterObjectEntries } from '../utils/utilityFunctions';

// Extract models from db export
const { StudentMeta } = dbModels;

export const getStudentMeta = async (req, res, next) => {
    try {
        const studentMeta = await StudentMeta.findOne({ where: { userId: req.user.id } }); 
        if(!studentMeta) {
            return next(new AppError("At the moment, there is no personal information defined for your account.", 400));
        }
        return res.status(200).json({
            status: "success",
            data: studentMeta
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const createStudentMeta = async (req, res, next) => {
    const { username, dob, gender, nationality, phone_number, street_adress, city, state, country, zip_code } = req.body;
    try {
        let studentMeta = await StudentMeta.findOne({where: { userId: req.user.id }});
        if(studentMeta) {
            return next(new AppError("You already defined your meta information, plase use update route to modify", 400));
        }
        studentMeta = await StudentMeta.create({
            username,
            dob,
            gender,
            nationality,
            phone_number,
            street_adress,
            city,
            state,
            country,
            zip_code,
            userId: req.user.id
        });
        return res.status(201).json({
            status: "success",
            message: "Student meta information created!",
            data: studentMeta
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const updateStudentMeta = async (req, res, next) => {
    try{
        // FILTER BODY AND UPDATE SPECIFIC FIELDS
        const filteredBody = filterObjectEntries(req.body, 'username', 'dob', 'gender', 'nationality', 'phone_number', 'street_adress', 'city', 'state', 'country', 'zip_code');
        // FIND THE USER AND UPDATE INFO
        const currentStudentMeta = await StudentMeta.findOne({where: { username: req.params.username }});
        if(!currentStudentMeta) {
            return next(new AppError("This meta information can not be updated, please try again.", 400));
        }
        const updateMeta = await StudentMeta.update(filteredBody, {where: { username: req.params.username }});
        const updatedStudentMeta = await StudentMeta.findOne({where: {username: req.body.username}});
        // JSON RESPONSE WITH UPDATED KIN
        return res.status(200).json({
            status: "Success",
            message: "Student meta information has been updated!",
            data: updatedStudentMeta
        });
    }
    catch(err) {
        return res.status(500).json({
            status: 500,
            message: "There is an error updating your info, please try again..."
        });
    }
}

export const deleteStudentMeta = async (req, res, next) => {
    try {
        const currentStudentMeta = await StudentMeta.findOne({ where: {username: req.params.username}});

        if(!currentStudentMeta) {
            return next(new AppError("This meta information can not be deleted, please try again.", 400));
        }

        await currentStudentMeta.destroy();

        return res.status(204).json({
            status: "success",
            message: "Student meta information has been deleted!"
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad Request",
            message: "There is an error deleting your meta information, please try again..."
        });
    }
}