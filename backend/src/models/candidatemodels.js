const db = require("../database/database");

async function newcandidate(candidate_name,candidate_id,election_id){

    const [result]= await db.execute(
        `INSERT INTO candidates (candidatename,candidateid,electionid) VALUES (?,?,?)`, [candidate_name, candidate_id, election_id]
    );

    const candidate = {
        candidate_name, 
        candidate_id, 
        election_id
    }

    return candidate ;
};

module.exports={newcandidate}