import dbModels from '../models';
import AppError from '../utils/appError';

// Extract models from db export
const { User, Enrollment, Hall, HallRoom } = dbModels;

export const getAccommodatedUser = async (req, res, next) => {
    try {
        const currentStudent = await User.findOne({ 
            where: { id: req.user.id },
            include: [
                {
                    model: Enrollment,
                    attributes: ['university']
                },
                {
                    model: HallRoom,
                    where: { userId: req.user.id },
                    attributes: ['room_number', 'room_floor', 'room_rent', 'room_beds']
                },
                {
                    model: Hall,
                    where: { id: req.user.hallId },
                    attributes: ['hall_name', 'rooms_number', 'students_number', 'student_per_room', 'min_grade', 'max_grade']
                }
            ]
        });

        if(!currentStudent) {
            return next(new AppError("You are not accommodated, please enroll", 404));
        }

        const currentStudentNeighbors = await HallRoom.findAll({
            where: {
                hallId: currentStudent.hallId,
                room_number: currentStudent.HallRoom.room_number
            },
            attributes: ['userId'],
        });

        const neighborsArr = currentStudentNeighbors.map((neighbor) => (neighbor.userId));

        const fetchedNeighbors = await User.findAll({ 
            where: { id: neighborsArr },
            attributes: ['first_name', 'last_name', 'email'],
            include: [{
                model: Enrollment,
                attributes: ['university', 'year_of_study', 'type_of_study', 'grade', 'financial_type', 'nationality', 'student_gender'],
            }]
        });

        return res.status(200).json({
            status: "Success",
            message: "Accommodated student fetched!",
            accommodatedUser: {
                student: currentStudent,
                neighbors: fetchedNeighbors
            }
        });
    }
    catch(err) {
        return res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again....",
        }); 
    }
}

