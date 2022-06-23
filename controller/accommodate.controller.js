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
                    attributes: ['number', 'floor', 'rent_per_month', 'beds_number']
                },
                {
                    model: Hall,
                    where: { id: req.user.hallId },
                    attributes: ['hall_name', 'hall_number', 'total_rooms', 'total_students', 'students_in_room', 'min_grade', 'max_grade']
                }
            ]
        });

        if(!currentStudent || !currentStudent.hallId || !currentStudent.HallRoom.number) {
            return next(new AppError("You are not accommodated, please enroll", 404));
        }

        const currentStudentNeighbors = await HallRoom.findAll({
            where: {
                hallId: currentStudent.hallId,
                number: currentStudent.HallRoom.number
            },
            attributes: ['userId'],
        });

        const neighborsArr = currentStudentNeighbors.filter((neighbor) => neighbor.userId !== req.user.id).map((neighbor) => (neighbor.userId));

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
            data: {
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
