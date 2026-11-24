const db = require("../database/database");

async function newvoters(values){

    const [result] = await db.query (

        `INSERT INTO voters (email,voter_name,electionid) VALUES ?`,[values]

    );
    
    const voters = {
        values
    }
    
    return voters;
}

module.exports={newvoters}