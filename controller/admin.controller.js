import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import dbModels from '../models';
import AppError from '../utils/appError';
import { filterObjectEntries } from '../utils/utilityFunctions';

// Extract models from db export
const { User, Enrollment, Hall, HallRoom } = dbModels;

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Enrollment
            }],
            order: [
                [{model: 'Enrollment'}, 'grade', 'ASC'],
                [{model: 'Enrollment'}, 'year_of_study', 'ASC'],
            ]
        });

        if(!users) {
            return next(new AppError("There are no users in the database, please try again...", 500));
        }

        return res.status(200).json({
            status: "success",
            message: 'Users Fetched',
            students: users.filter(user => user.email !== req.user.email)
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const getUsersByQuerry = async (req, res, next) => {
    const queryObj = {...req.query};
    const excludedFields = ['page', 'limit', 'sort', 'fields'].forEach(field => delete queryObj[field]);

    if(Object.keys(queryObj).length === 0) {
        return next(new AppError("Please type a querry or select something from the inputs below.", 500));
    }
    if(queryObj.searchQuerry) {
        const validatedQuerrySearch = queryObj.searchQuerry.match(/^[ A-Za-z0-9_@./-]*$/g);
        if(validatedQuerrySearch === null) {
            return next(new AppError("Your querry must contain only alphanumeric chars and the following: _@./-", 500));
        }
    }

    try {
        if(queryObj.searchQuerry && (queryObj.university === null || !queryObj.university)) {
            const users = await User.findAll({
                where: {
                    role: 'student',
                    [Op.or]: [
                        {
                            email: queryObj.searchQuerry,
                        },
                        {
                           first_name: { [Op.like]: `%${queryObj.searchQuerry}%` }
                        },
                        {
                            last_name: { [Op.like]: `%${queryObj.searchQuerry}%` }
                        }
                    ],
                }
            });

            if(users.length === 0) {
                return next(new AppError("There are no users that match your search querry", 400));
            }
            
            if(!users) {
                return next(new AppError("There are no users in the database, please try again...", 400));
            }
    
             return res.status(200).json({
                status: "success",
                results: users.length,
                students: users
            });
        } else if (queryObj.university && (queryObj.searchQuerry === null || !queryObj.searchQuerry)) {
            const users = await User.findAll({
                where: { role: 'student' },
                include: [{
                    model: Enrollment,
                    where: { 
                        university: queryObj.university 
                    },
                    attributes: ['id']
                }],
                
            });

            if(users.length === 0) {
                return next(new AppError("There are no users that match your search querry", 400));
            }
            
            if(!users) {
                return next(new AppError("There are no users in the database, please try again...", 400));
            }
    
             return res.status(200).json({
                status: "success",
                results: users.length,
                students: users
            });
        } else if (queryObj.searchQuerry && queryObj.university) {
            const users = await User.findAll({
                where: {
                    role: 'student',
                    [Op.or]: [
                        {
                            email: queryObj.searchQuerry,
                        },
                        {
                           first_name: { [Op.like]: `%${queryObj.searchQuerry}%` }
                        },
                        {
                            last_name: { [Op.like]: `%${queryObj.searchQuerry}%` }
                        }
                    ],
                },
                include: [{
                    model: Enrollment,
                    where: { university: queryObj.university },
                    attributes: ['id']
                }]
            });

            if(users.length === 0) {
                return next(new AppError("There are no users that match your search querry", 400));
            }
            
            if(!users) {
                return next(new AppError("There are no users in the database, please try again...", 400));
            }
    
             return res.status(200).json({
                status: "success",
                results: users.length,
                students: users
            });
        }
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const getUser = async (req, res, next) => {
    const targetId = req.params.id;
    try {
        const user = await User.findOne({where: { id: targetId}});
        if(!user) {
            return next(new AppError("404 User not found!", 404));
        }
        return res.status(200).json({
            status: "success",
            user: user
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        });
    }
}

export const getAccommodatedUser = async (req, res, next) => {
    const targetId = req.params.id;
    try {
        const user = await User.findOne({
            where: { id: targetId},
            include: [{
                model: Enrollment,
            },
            {
                model: Hall,
                attributes: ['students_number', 'rooms_number', 'student_per_room', 'min_grade']
            },
            {
                model: HallRoom,
            }],
        });
        if(!user) {
            return next(new AppError("404 User not found!", 404));
        }
        return res.status(200).json({
            status: "success",
            user: user
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        }); 
    }
}

export const getStudentNeighbors = async (req, res, next) => {
    const targetId = req.params.id;
    if(!targetId) {
        return next(new AppError("At this moment, this student has no neighbors", 500));
    }
    try {
        const currentUser = await User.findOne({
            where: { id: targetId },
            include: [
                {
                    model: HallRoom,
                    attributes: ['room_number', 'room_floor', 'room_rent', 'room_beds']
                },
            ]
        });
        if(!currentUser) {
            return next(new AppError("404 User not found, please refresh the page!", 404));
        }
        const neighbors = await HallRoom.findAll({
            where: {
                hallId: currentUser.hallId,
                room_number: currentUser.HallRoom.room_number
            },
            attributes: ['userId'],
        });

        const neighborsArr = neighbors.map((neighbor) => (neighbor.userId));
        const fetchedNeighbors = await User.findAll({ 
            where: { id: neighborsArr },
            attributes: ['id', 'first_name', 'last_name', 'email'],
            include: [{
                model: Enrollment,
                attributes: ['university', 'year_of_study', 'type_of_study', 'grade', 'financial_type', 'nationality', 'student_gender'],
            }]
        });
        if(!fetchedNeighbors) {
            return next(new AppError("At this moment, this student has no neighbors", 500));
        }

        return res.status(200).json({
            status: "Success",
            message: "Neighbors fetched!",
            fetchedNeighbors
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "At this moment, this student has no neighbors."
        });
    }
}

export const createUser = async (req, res, next) => {
    const { first_name, last_name, email, password, password_confirm, role } = req.body;
    try {
        // HASH PASSWORD
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await User.findOne({where: { email: email }});

        if(existingUser) {
            return next(new AppError("E-mail is used, please try with another one", 500));
        }
        const newUser = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword,
            role: role
        });
        return res.status(201).json({
            status: "success",
            message: "User created!",
            userData: newUser
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again."
        })
    }
}

export const updateUser = async (req, res, next) => {
    const targetEmail = req.params.email;
    try {
        const user = await User.findOne({where: {email: targetEmail}});

        if(!user) {
            return next(new AppError("User not found.", 404));
        }
        // FILTER BODY AND UPDATE SPECIFIC FIELDS
        const filteredBody = filterObjectEntries(req.body, 'first_name', 'last_name', 'email', 'role');
        const updatedUser = await User.update(filteredBody, {where: { email: targetEmail }});

        return res.status(200).json({
            status: "success",
            message: "User has been updated!",
        });
    }
    catch(err) {
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        })
    }
}

export const updatePwd = async (req, res, next) => {
    const targetEmail = req.params.email;
    try {
        const user = await User.findOne({where: {email: targetEmail}});
        if(!user) {
            return next(new AppError("User not found.", 404));
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPasswordNew = await bcrypt.hash(req.body.password_new, salt);

        if(!await user.checkPwdValidation(req.body.password_confirm, user.password)) {
            return next(new AppError("Your current password is wrong.", 401));
        }

        // UPDATE PASSWORD
        user.password = hashedPasswordNew;
        user.password_changed_at = new Date(Date.now()).toUTCString();
        await user.save();

        return res.status(200).json({
            status: "success",
            message: "User's password has been updated!"
        });
    }

    catch(err) {
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
        })
    }
}

export const deleteUser = async (req, res, next) => {
    const targetEmail = req.params.email;
    try {
        const user = await User.findOne({where: { email: targetEmail}});
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