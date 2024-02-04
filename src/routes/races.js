const express = require("express");
const router = express.Router();

const {
    getAllRaces,
    getRace,
    createRace,
    updateRace,
    deleteRace,
} = require("../controllers/race");

router.route("/").post(createRace).get(getAllRaces);
router.route("/:id").get(getRace).delete(deleteRace).patch(updateRace);

module.exports = router;
