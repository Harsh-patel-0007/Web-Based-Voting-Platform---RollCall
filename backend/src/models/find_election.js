const db = require("../database/database");
require("dotenv").config();

async function find_elections(userid){
    
    
    
    const [result] = await db.query(
        `SELECT electionId , Title , user_id , Description, Open_time ,Close_time , created_at FROM elections WHERE user_id = ?`,userid
    );

    return result ;
}

module.exports = {find_elections};