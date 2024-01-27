const express = require("express");
const router = express.Router();

const {
    getAllWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
} = require("../controllers/workout");

router.route("/").post(createWorkout).get(getAllWorkouts);
router.route("/:id").get(getWorkout).delete(deleteWorkout).patch(updateWorkout);

module.exports = router;
