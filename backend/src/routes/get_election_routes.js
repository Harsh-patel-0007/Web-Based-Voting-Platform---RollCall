const express = require("express");
const router = express.Router();

const get_elections = require("../controllers/getelection");
const { protect } = require("../middleware/auth_middleware");

router.get("/get_election",protect, get_elections.get_users_election);

module.exports = router;