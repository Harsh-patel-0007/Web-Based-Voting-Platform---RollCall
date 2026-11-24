const express = require("express");
const get_voter_election = require("../controllers/getsingleelection");
const router = express.Router();


router.post("/get_voter_election", get_voter_election.get_single_election);

module.exports = router;