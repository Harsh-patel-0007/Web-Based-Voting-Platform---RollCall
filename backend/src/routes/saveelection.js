const express = require("express");
const router = express.Router();
const upload = require("../middleware/multermiddleware");

const save_electionControllers = require("../controllers/save_election");
const { protect } = require("../middleware/auth_middleware");

router.post("/save_election", protect , upload.single("file") ,save_electionControllers.save_election);

module.exports = router;