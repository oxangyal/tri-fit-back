const Race = require("../models/Race");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllRaces = async (req, res) => {
    const races = await Race.find({ createdBy: req.user.userId }).sort(
        "createdAt"
    );

    res.status(StatusCodes.OK).json({ races, count: races.length });
};

const getRace = async (req, res) => {
    const {
        user: { userId },
        params: { id: raceId },
    } = req;

    const race = await Race.findOne({
        _id: raceId,
        createdBy: userId,
    });
    if (!race) {
        throw new NotFoundError(`No race with id ${raceId}`);
    }
    res.status(StatusCodes.OK).json({ race });
};

const createRace = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const race = await Race.create(req.body);
    res.status(StatusCodes.CREATED).json({ race });
};

const updateRace = async (req, res) => {
    const {
        body: { race, title, timeOfCompletion, date, location },
        user: { userId },
        params: { id: raceId },
    } = req;

    if (!race || !date || !title) {
        throw new BadRequestError(
            "Race, Date and Title fields cannot be empty"
        );
    }

    const { hours, minutes } = timeOfCompletion;

    if (
        typeof hours !== "number" ||
        typeof minutes !== "number" ||
        hours < 0 ||
        minutes < 0 ||
        minutes > 59
    ) {
        throw new BadRequestError(
            "Invalid timeOfCompletion. Please provide valid hours and minutes."
        );
    }

    const updatedRace = await Race.findByIdAndUpdate(
        { _id: raceId, createdBy: userId },
        { race, title, timeOfCompletion, date, location },
        { new: true, runValidators: true }
    );
    if (!updatedRace) {
        throw new NotFoundError(`No race with id ${raceId}`);
    }
    res.status(StatusCodes.OK).json({ updatedRace });
};

const deleteRace = async (req, res) => {
    const {
        user: { userId },
        params: { id: raceId },
    } = req;

    const deletedRace = await Race.findByIdAndDelete({
        _id: raceId,
        createdBy: userId,
    });
    res.status(StatusCodes.OK).json({
        message: "Race successfully deleted",
    });
    if (!deletedRace) {
        throw new NotFoundError(`No race with id ${raceId}`);
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {
    createRace,
    deleteRace,
    getAllRaces,
    updateRace,
    getRace,
};
