import dbModels from '../models';
import AppError from '../utils/appError';
import { filterObjectEntries } from '../utils/utilityFunctions';

// Extract models from db export
const { University } = dbModels;

export const createUniversity = async (req, res, next) => {
    try{
        const { title, keyword, rector, phone_number, halls } = req.body;
        const university = await University.findOne({ 
            where: { title: title },
        });
        if(university) {
            return next(new AppError("University is already defined, please try to insert a different one.", 409));
        }
        const newUniversity = await University.create({
            title, 
            keyword,
            rector, 
            phone_number, 
            halls
        });
        return res.status(200).json({
            status: "Success",
            message: "University has been created!",
            enrollment: newUniversity
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The university create request can not be resolved, please try again...",
        }); 
    }
}

export const updateUniversity = async (req, res, next) => {
    try {
        let alreadyExists = false;
        const currentUniversity = await University.findOne({ 
            where: { keyword: req.params.keyword },
        });
        const allUniversities = await University.findAll();
    
        if(!currentUniversity) {
            return next(new AppError("The specified university does not exists.", 404));
        }

        const filteredBody = filterObjectEntries(req.body, 'title', 'keyword', 'rector', 'phone_number', 'halls');

        allUniversities.length !==0 && allUniversities.forEach(university => {
            if(university.title === filteredBody.title || university.keyword === filteredBody.keyword) {
                return next(new AppError("The specified university already exists.", 409));
            }
        });

        const universityToUpdate = await University.update(filteredBody, {where: { keyword: req.params.keyword }})
        const updatedUniversity = await University.findOne({ 
            where: { keyword: req.params.keyword },
        });

        return res.status(200).json({
            status: "Success",
            message: "University has been updated!",
            kin: updatedUniversity
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad Request",
            message: "There is an error while updating the specific university, please try again..."
        });
    }
}

export const deleteUniversity = async (req, res, next) => {
    try {
        const currentUniversity = await University.findOne({ 
            where: { keyword: req.params.keyword },
        });
    
        if(!currentUniversity) {
            return next(new AppError("University not found", 404));
        }
    
        await currentUniversity.destroy();
    
        return res.status(204).json({
            status: "success",
            message: "University has been deleted!"
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "There is an error while deleting the specified University, please try again..."
        });
    }
}

export const getUniversities = async (req, res, next) => {
    try {
        const universities = await University.findAll();

        if(!universities) {
            return next(new AppError("404 Universities not found!", 404));
        }

        return res.status(200).json({
            status: "success",
            universities
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const getUniversityById = async (req, res, next) => {
    try {
        const university = await University.findOne({ 
            where: { keyword: req.params.keyword }
        });

        if(!university) {
            return next(new AppError("404 University not found!", 404));
        }

        return res.status(200).json({
            status: "success",
            university
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}