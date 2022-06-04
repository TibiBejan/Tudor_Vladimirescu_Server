import dbModels from '../models';
import AppError from '../utils/appError';
import { filterObjectEntries } from '../utils/utilityFunctions';

// Extract models from db export
const { HallStaff } = dbModels;

export const createHallStaff = async (req, res, next) => {
    try{
        const { name, email, phone_number, position, hallId } = req.body;
        
        const hallStaffMember = await HallStaff.findOne({ 
            where: { name: name, hallId: hallId },
        });
        if(hallStaffMember) {
            return next(new AppError("Hall Staff is already defined, please try to insert a different one.", 409));
        }
        const newHallStaffMember = await HallStaff.create({
            name, email, phone_number, position, hallId
        });
        return res.status(200).json({
            status: "Success",
            message: "Hall Staff Member has been created!",
            hall: newHallStaffMember
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The hall staff member create request can not be resolved, please try again...",
        }); 
    }
}

export const updateHallStaff = async (req, res, next) => {
    const { name, email, phone_number, position, hallId } = req.body;
    // try {
        // const { name, email, phone_number, position, hallId } = req.body;
    //     let alreadyExists = false;
    //     const currentHallStaffMember = await HallStaff.findOne({ 
    //         where: { hallId: req.params.hallId, name: name },
    //     });
    //     const allHallStaffMember = await HallStaff.findAll();
    
    //     if(!currentHallStaffMember) {
    //         return next(new AppError("The specified hall staff member does not exists.", 404));
    //     }

    //     const filteredBody = filterObjectEntries(req.body, 'hallId', 'name', 'email', 'phone_number', 'position');
    //     allHallStaffMember.length !==0 && allHallStaffMember.forEach(hallStaffEntry => {
    //         if(hallStaffEntry.name === filteredBody.name) {
    //             return next(new AppError("The specified hall satff member already exists.", 409));
    //         }
    //     });

    //     const hallStaffToUpdate = await HallStaff.update(filteredBody, {where: { hallId: req.params.hallId, name: name }})
    //     const updatedHallStaffMember = await Hall.findOne({ 
    //         where: { hallId: req.params.hallId, name: req.body.name },
    //     });

    //     return res.status(200).json({
    //         status: "Success",
    //         message: "Hall staff member has been updated!",
    //         hallStaff: updatedHallStaffMember
    //     });
    // }
    // catch(err) {
    //     return res.status(500).json({
    //         status: "Bad Request",
    //         message: "There is an error while updating the specific hall staff member, please try again..."
    //     });
    // }
}

export const deleteHallStaff = async (req, res, next) => {
    console.log(req.params);
    // try {
    //     const currentHallStaffMember = await HallStaff.findOne({ 
    //         where: { hallId: req.params.hallId, name: req.body.name },
    //     });
    
    //     if(!currentHallStaffMember) {
    //         return next(new AppError("Hall not found", 404));
    //     }
    
    //     await currentHallStaffMember.destroy();
    
    //     return res.status(204).json({
    //         status: "success",
    //         message: "Hall staff member has been deleted!"
    //     });
    // }
    // catch(err) {
    //     return res.status(500).json({
    //         status: "Error",
    //         message: "There is an error while deleting the specified hall staff member, please try again..."
    //     });
    // }
}

export const getHallStaff = async (req, res, next) => {
    console.log(req.params);
    // try {
    //     const hallStaffMembers = await HallStaff.findAll({ 
    //         where: { hallId: req.params.hallId }
    //     });

    //     if(!hallStaffMembers) {
    //         return next(new AppError("404 Hall Staff members are not found!", 404));
    //     }

    //     return res.status(200).json({
    //         status: "success",
    //         hallStaffMembers
    //     });
    // }
    // catch(err) {
    //     return res.status(500).json({
    //         status: "Error",
    //         message: "Internal Server Error while fetching the hall staff members - Please try again..."
    //     });
    // }
}