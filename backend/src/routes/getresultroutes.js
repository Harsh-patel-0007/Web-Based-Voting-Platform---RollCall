const express = require("express");
const get_election_result = require("../controllers/getresult");
const router = express.Router();

router.get("/get_result/:electionId",get_election_result.getElectionResults);

module.exports = router;
