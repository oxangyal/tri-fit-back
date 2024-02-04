const mongoose = require("mongoose");

const RaceSchema = new mongoose.Schema(
    {
        race: {
            type: String,
            enum: [
                "sprint",
                "olympic",
                "duathlon",
                "aquathon",
                "half",
                "full",
            ],
            required: [true, "Please provide race"],
            default: "sprint",
        },
        title: {
            type: String,
            required: [true, "Please provide title"],
        },
        timeOfCompletion: {
            hours: {
                type: Number,
                min: 0,
            },
            minutes: {
                type: Number,
                min: [0, "Minutes must be greater than or equal to 0"],
                max: [59, "Minutes must be less than or equal to 59"],
            },
        },
        date: {
            type: Date,
            default: Date.now,
            required: [true, "Please provide date"],
        },
        location: {
            city: {
                type: String,
            },
            state: {
                type: String,
            },
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("race", RaceSchema);
