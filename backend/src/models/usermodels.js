const db = require("../database/database");

async function createUser(username , userid, email, password){

        const [result] = await db.execute(
            `insert into users (username ,userid , email, password) VALUES (?,?,?,?)`,[username,userid ,email,password] );
            
            return result;
        
};

async function find_userbyemail(email){

    const [rows] = await db.execute(
        "SELECT username, userid , email, password , created_at FROM users WHERE email =?",[email]);
        
    return rows[0];
}

module.exports= {createUser,find_userbyemail}