const db = require("../database/database")

async function newElection(electionId,Title,userid ,Description,Open_time, Close_time)
{

    try{

        const [newelection]=await db.execute(
            `INSERT INTO elections (electionId,Title,user_id,Description,Open_time, Close_time) VALUES(?,?,?,?,?,?)`,
            [
                electionId,
                Title,
                userid, 
                Description, 
                Open_time, 
                Close_time
            ]
        );

        const election ={
            electionId,
            Title,
            userid,
            Description,
            Open_time,
            Close_time
        }
        
        return election;
    }
    catch(error){
        
        console.log(error)
        throw error;
    }
};

module.exports = {newElection}