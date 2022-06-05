import dbModels from '../models';
import AppError from '../utils/appError';
import { filterObjectEntries } from '../utils/utilityFunctions';

// Extract models from db export
const { Relatives } = dbModels;

export const getAllRelatives = async (req, res, next) => {
    try {
        const relatives = await Relatives.findAll({ where: { userId: req.user.id } }); 

        console.log(relatives)
        if(!relatives || relatives.length === 0) {
            return next(new AppError("There are no relatives related to this user.", 400));
        }
        return res.status(200).json({
            status: "success",
            results: relatives.length,
            kins: relatives
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const getRelativesById = async (req, res, next) => {
    try {
        const relative = await Relatives.findOne({ where: { userId: req.user.id }});
        if(!relative) {
            return next(new AppError("404 Kin not found!", 404));
        }
        return res.status(200).json({
            status: "success",
            relative
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const createRelatives = async (req, res, next) => {
    const { first_name, last_name, email, relation, adress, phone_number } = req.body;
    try {
        const definedRelation = await Relatives.findOne({ where: { userId: req.user.id, relation: relation}});

        if(definedRelation) {
            return next(new AppError("This relative relation is already defined, please add a new one.", 500));
        }
        const newRelatives = await Relatives.create({
            first_name,
            last_name,
            email,
            relation,
            adress,
            phone_number,
            userId: req.user.id
        });
        return res.status(201).json({
            status: "success",
            message: "Relative created!",
            kin: newRelatives
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const updateRelatives = async (req, res, _) => {
    try{
        // FILTER BODY AND UPDATE SPECIFIC FIELDS
        const filteredBody = filterObjectEntries(req.body, 'first_name', 'last_name', 'email', 'relation', 'adress', 'phone_number');
        // FIND THE USER AND UPDATE INFO
        const currentRelatives = await Relatives.update(filteredBody, { where: { id: req.params.id, userId: req.user.id } });
        const updatedRelatives = await Relatives.findOne({ where: { id: req.params.id, userId: req.user.id } })

        // JSON RESPONSE WITH UPDATED KIN
        return res.status(200).json({
            status: "Success",
            message: "Kin has been updated!",
            kin: updatedRelatives
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad Request",
            message: "There is an error updating your info, please try again..."
        });
    }
}

export const deleteRelatives = async (req, res, next) => {
    try {
        const relatives = await Relatives.findOne({where: { id: req.params.id}});
        if(!relatives) {
            return next(new AppError("Relatives not found", 404));
        }
        await relatives.destroy();
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