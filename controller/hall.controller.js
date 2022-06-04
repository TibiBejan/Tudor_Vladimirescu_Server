import dbModels from '../models';
import AppError from '../utils/appError';
import { filterObjectEntries } from '../utils/utilityFunctions';

// Extract models from db export
const { Hall, HallStaff } = dbModels;

export const createHall = async (req, res, next) => {
    try{
        const { hall_number, hall_name, total_rooms, total_students, students_in_room, min_grade, max_grade, facilities, universities, bathroom, description, hall_adress, hall_latitude, hall_longitude, contact_number } = req.body;
        
        const hall = await Hall.findOne({ 
            where: { hall_name: hall_name },
        });
        if(hall) {
            return next(new AppError("Hall is already defined, please try to insert a different one.", 409));
        }
        const newHall = await Hall.create({
            hall_number,
            hall_name,
            total_rooms,
            total_students,
            students_in_room,
            min_grade,
            max_grade,
            facilities,
            universities,
            bathroom,
            description,
            hall_adress,
            hall_latitude,
            hall_longitude,
            contact_number
        });
        return res.status(200).json({
            status: "Success",
            message: "Hall has been created!",
            data: newHall
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            data: null,
            message: "The hall create request can not be resolved, please try again...",
        }); 
    }
}

export const updateHall = async (req, res, next) => {
    try {
        let alreadyExists = false;
        const currentHall = await Hall.findOne({ 
            where: { hall_name: req.params.hall_name },
        });
        const allHalls = await Hall.findAll();
    
        if(!currentHall) {
            return next(new AppError("The specified hall does not exists.", 404));
        }

        const filteredBody = filterObjectEntries(req.body, 'total_rooms', 'total_students', 'students_in_room', 'min_grade', 'max_grade', 'facilities', 'universities', 'bathroom', 'description', 'hall_adress', 'hall_latitude', 'hall_longitude', 'contact_number');
        allHalls.length !==0 && allHalls.forEach(hallEntry => {
            if(hallEntry.hall_name === filteredBody.hall_name || hallEntry.hall_number === filteredBody.hall_number) {
                return next(new AppError("The specified hall already exists.", 409));
            }
        });

        const hallToUpdate = await Hall.update(filteredBody, {where: { hall_name: req.params.hall_name }})
        const updatedHall = await Hall.findOne({ 
            where: { hall_name: req.params.hall_name },
        });

        return res.status(200).json({
            status: "Success",
            message: "Hall has been updated!",
            data: updatedHall
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad Request",
            data: null,
            message: "There is an error while updating the specific hall, please try again..."
        });
    }
}

export const deleteHall = async (req, res, next) => {
    try {
        const currentHall = await Hall.findOne({ 
            where: { hall_name: req.params.hall_name },
        });
    
        if(!currentHall) {
            return next(new AppError("Hall not found", 404));
        }
    
        await currentHall.destroy();
    
        return res.status(204).json({
            status: "success",
            message: "Hall has been deleted!"
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            data: null,
            message: "There is an error while deleting the specified hall, please try again..."
        });
    }
}

export const getHalls = async (req, res, next) => {
    try {
        const halls = await Hall.findAll({ 
            include: [HallStaff]
        });

        if(!halls) {
            return next(new AppError("404 Hall not found!", 404));
        }

        return res.status(200).json({
            status: "success",
            data: halls,
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            data: null,
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const getHallById = async (req, res, next) => {
    try {
        const hall = await Hall.findOne({ 
            where: { hall_name: req.params.hall_name },
            include: [HallStaff]
        });

        if(!hall) {
            return next(new AppError("404 Hall not found!", 404));
        }

        return res.status(200).json({
            status: "success",
            data: hall
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            data: null,
            message: "Internal Server Error - Please try again..."
        });
    }
}