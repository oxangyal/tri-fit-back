const Workout = require("../models/Workout");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { params } = require("../routes/auth");

// Sorting by upcoming workouts and pagination  4 workouts per page
const getAllWorkoutsUpcoming = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const sortField = req.query.sortField;
        const sortFlag = req.query.sortOrder === "asc" ? 1 : -1;
        console.log("Page:" + req.query.page);
        const limit = 4;
        const skip = (page - 1) * limit;
        const workoutsCount = await Workout.find({
            createdBy: req.user.userId,
            date: { $gte: new Date() },
        });

        const totalPages = workoutsCount.length / limit;

        const workouts = await Workout.find({
            createdBy: req.user.userId,
            date: { $gte: new Date() },
        })
            .sort({ [sortField]: sortFlag })
            .skip(skip)
            .limit(limit);
        res.status(StatusCodes.OK).json({
            workouts,
            count: workouts.length,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal server error",
        });
    }
};

// const getAllWorkoutsUpcoming = async (req, res) => {
//     try {
//         const workouts = await Workout.find({
//             createdBy: req.user.userId,
//             date: { $gte: new Date() },
//         }).sort({ date: 1 });
//         res.status(StatusCodes.OK).json({ workouts, count: workouts.length });
//     } catch (error) {
//         console.error(error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             error: "Internal server error",
//         });
//     }
// };

const getAllWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({
            createdBy: req.user.userId,
        }).sort({ date: 1 });
        res.status(StatusCodes.OK).json({ workouts, count: workouts.length });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal server error",
        });
    }
};

const getWorkout = async (req, res) => {
    const {
        user: { userId },
        params: { id: workoutId },
    } = req;

    const workout = await Workout.findOne({
        _id: workoutId,
        createdBy: userId,
    });
    if (!workout) {
        throw new NotFoundError(`No workout with id ${workoutId}`);
    }
    res.status(StatusCodes.OK).json({ workout });
};

const createWorkout = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const workout = await Workout.create(req.body);
    res.status(StatusCodes.CREATED).json({ workout });
};

const updateWorkout = async (req, res) => {
    const {
        body: {
            workoutType,
            duration,
            intensity,
            indoor,
            description,
            date,
            completed,
        },
        user: { userId },
        params: { id: workoutId },
    } = req;

    if (!workoutType || !duration) {
        throw new BadRequestError(
            "Workout type and duration fields cannot be empty"
        );
    }

    const workout = await Workout.findByIdAndUpdate(
        { _id: workoutId, createdBy: userId },
        {
            workoutType,
            duration,
            intensity,
            indoor,
            description,
            date,
            completed,
        },
        { new: true, runValidators: true }
    );
    if (!workout) {
        throw new NotFoundError(`No workout with id ${workoutId}`);
    }
    res.status(StatusCodes.OK).json({ workout });
};

const deleteWorkout = async (req, res) => {
    const {
        user: { userId },
        params: { id: workoutId },
    } = req;
    const workout = await Workout.findByIdAndDelete({
        _id: workoutId,
        createdBy: userId,
    });
    if (!workout) {
        throw new NotFoundError(`No workout with id ${workoutId}`);
    }
    res.status(StatusCodes.OK).json({
        message: "Workout successfully deleted",
    });
    res.status(StatusCodes.OK).send();
};

module.exports = {
    createWorkout,
    deleteWorkout,
    getAllWorkouts,
    getAllWorkoutsUpcoming,
    updateWorkout,
    getWorkout,
};
