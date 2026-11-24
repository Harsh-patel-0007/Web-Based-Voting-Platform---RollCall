const db = require("../database/database");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // 1. Get election details
        const [elections] = await db.execute(
            `SELECT electionid, title, description,
                    open_time, close_time
             FROM elections
             WHERE electionid = ?`,
            [electionId]
        );

        if (elections.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Election not found"
            });
        }

        // 2. Get candidate vote counts
        const [results] = await db.execute(
            `SELECT
                c.candidateid,
                c.candidatename,
                COUNT(v.candidateid) AS total_votes
             FROM candidates c
             LEFT JOIN votes v
                ON v.candidateid = c.candidateid
                AND v.electionid = c.electionid
             WHERE c.electionid = ?
             GROUP BY c.candidateid, c.candidatename
             ORDER BY total_votes DESC`,
            [electionId]
        );

        // 3. Count eligible voters
        const [eligibleRows] = await db.execute(
            `SELECT COUNT(*) AS total
             FROM voters
             WHERE electionid = ?`,
            [electionId]
        );

        // 4. Count voters who voted
        const [votedRows] = await db.execute(
            `SELECT COUNT(DISTINCT voterid) AS total
             FROM votes
             WHERE electionid = ?`,
            [electionId]
        );

        const eligibleVoters = Number(eligibleRows[0].total);
        const votesCast = Number(votedRows[0].total);
        const didNotVote = Math.max(0, eligibleVoters - votesCast);

        const turnout = eligibleVoters > 0
            ? (votesCast / eligibleVoters) * 100
            : 0;

        return res.json({
            success: true,
            election: elections[0],
            statistics: {
                eligibleVoters,
                votesCast,
                didNotVote,
                turnout: Number(turnout.toFixed(1))
            },
            results
        });

    } catch (error) {
        console.error("Error fetching election results:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch election results"
        });
    }
};

module.exports = { getElectionResults };