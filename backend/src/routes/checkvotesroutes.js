const express = require("express");
const router = express.Router();

const { checkStatus } = require("../controllers/voteStatus");

router.post("/verify-votes", checkStatus )

module.exports = router;