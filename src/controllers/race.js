const Race = require("../models/Race");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { params } = require("../routes/auth");

const getAllRacesList = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const sortField = req.query.sortField || "date"; 
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        const racesCount = await Race.find({
            createdBy: req.user.userId,
        }).countDocuments();
        const totalPages = Math.ceil(racesCount / limit);

        const races = await Race.find({ createdBy: req.user.userId })
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(StatusCodes.OK).json({
            races,
            count: races.length,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal server error",
        });
    }
};


const getAllRaces = async (req, res) => {
    const races = await Race.find({ createdBy: req.user.userId }).sort({
        date: 1,
    });

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
        body: { race, title, timeOfCompletion, date, location, description },
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
        { race, title, timeOfCompletion, date, location, description },
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
    getAllRacesList, 
    updateRace,
    getRace,
};
