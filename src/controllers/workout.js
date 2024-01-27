const Workout = require("../models/Workout");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { params } = require("../routes/auth");

const getAllWorkouts = async (req, res) => {

    const workouts = await Workout.find({ createdBy: req.user.userId }).sort(
        "createdAt"
    );

    res.status(StatusCodes.OK).json({ workouts, count: workouts.length });
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
        body: { workoutType, duration, intensity, indoor, description, completed },
        user: { userId },
        params: { id: workoutId },
    } = req;

    // console.log("Bububu");
    console.log(req.body);
    if (workoutType === "" || duration === "") {
        throw new BadRequestError(
            "Workout type or Duration fields cannot be empty"
        );
    }
    const workout = await Workout.findByIdAndUpdate(
        { _id: workoutId, createdBy: userId },
        { workoutType, duration, intensity, indoor, description, completed },
        // req.body,
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
    // console.log("Bububu");
    console.log(req.body);
    const workout = await Workout.findByIdAndRemove({
        _id: workoutId,
        createdBy: userId,
    });
    if (!workout) {
        throw new NotFoundError(`No workout with id ${workoutId}`);
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {
    createWorkout,
    deleteWorkout,
    getAllWorkouts,
    updateWorkout,
    getWorkout,
};
