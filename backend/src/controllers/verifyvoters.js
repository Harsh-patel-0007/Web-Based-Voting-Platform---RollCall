const db = require("../database/database");
const jwt = require("jsonwebtoken")
require("dotenv").config();// Adjust path to your DB file

const verifyVoter = async (req, res) => {
    try {
        const { email, electionid } = req.body;

        // 1. Validate input
        if (!email || !electionid) {
            return res.status(400).json({
                success: false,
                message: "Email and election ID are required"
            });
        }

        // 2. Check whether the voter is enrolled
        const [rows] = await db.execute(
            `SELECT voterid, electionid
             FROM voters
             WHERE email = ? AND electionid = ?
             LIMIT 1`,
            [email.trim(), electionid]
        );

        // 3. Check eligibility
        if (rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not eligible for this election"
            });
        }

        // 4. Store voter identity in the session
        req.session.verifiedVoterId = rows[0].voterid;
        req.session.verifiedElectionId = rows[0].electionid;

        console.log("before i am")

        // 5. Save the session
        await new Promise((resolve, reject) => {
            console.log("yss,yss")
            req.session.save((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        console.log(req.sessionID);
        console.log(req.session.verifiedElectionId)
        console.log(req.session.verifiedVoterId);

        // 6. Get election details
        const [elections] = await db.execute(
            `SELECT electionid,Title,Description, open_time, close_time
             FROM elections
             WHERE electionid = ?`,
            [rows[0].electionid]
        );

        if (elections.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        // 7. Get candidates for this election
        const [candidates] = await db.execute(
            `SELECT candidateid, candidatename
             FROM candidates
             WHERE electionid = ?`,
            [rows[0].electionid]
        );

        // 8. Return ballot details
        return res.status(200).json({
            success: true,
            message: "Voter session created",
            election: elections[0],
            candidates: candidates,
            voter: rows[0]
        });

    } catch (error) {
        console.error("Voter verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during voter verification"
        });
    }
};


const submitVote = async (req, res) => {

    try {
        console.log("in submit vote")
        // 1. Get voter identity from the server-side session
        const voterid = req.session.verifiedVoterId;
        const sessionElectionId = req.session.verifiedElectionId;

        console.log(req.sessionID);
        console.log(req.session)

        console.log(voterid,sessionElectionId);

        console.log("i am in submit vote");

        if (!voterid || !sessionElectionId) {
            return res.status(401).json({
                success: false,
                message: "Please verify your voter identity first"
            });
        }

        
        // 2. Get the selected election and candidate
        const { electionid, candidateid } = req.body;
        
        console.log("candidateid:",candidateid);
        console.log("electionid:",electionid)
        
        if (
            String(electionid) !== String(sessionElectionId) ||
            !candidateid
        ) {
            console.log("galat h")
            return res.status(400).json({
                success: false,
                message: "Invalid election or candidate"
            });
        }

        // 3. Check that the election is currently open
        const [elections] = await db.execute(
            `SELECT electionid
             FROM elections
             WHERE electionid = ?
               AND open_time <= NOW()
               AND close_time > NOW()
             FOR UPDATE`,
            [sessionElectionId]
        );

        if (elections.length === 0) {

            return res.status(403).json({
                success: false,
                message: "This election is not currently open"
            });
        }

        // 4. Confirm candidate belongs to this election
        const [candidates] = await db.execute(
            `SELECT candidateid
             FROM candidates
             WHERE candidateid = ?
               AND electionid = ?`,
            [candidateid, sessionElectionId]
        );

        if (candidates.length === 0) {
            console.log("candidates.length === 0");
            return res.status(400).json({
                success: false,
                message: "Invalid candidate for this election"
            });
        }

        // 5. Save the vote
        await db.execute(
            `INSERT INTO votes
                (voterid, electionid, candidateid, voted_at)
             VALUES (?, ?, ?, NOW())`,
            [voterid, sessionElectionId, candidateid]
        );

        // await db.commit();

        return res.status(200).json({
            success: true,
            message: "Vote submitted successfully"
        });

    } catch (error) {
        if (db) {
            // await db.rollback();
            console.log(error);
        }

        // MySQL duplicate-entry error
        if (error.code === "ER_DUP_ENTRY") {
            console.log("candidates.length === 000");
            return res.status(409).json({
                success: false,
                message: "You have already voted in this election"
            });
        }

        console.error("Vote submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not submit vote"
        });

    }
};

module.exports = { verifyVoter, submitVote };