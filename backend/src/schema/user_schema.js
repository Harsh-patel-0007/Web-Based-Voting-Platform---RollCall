const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(255) NOT NULL,
      userId VARCHAR(255) primary key, 
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      created_at timestamp default current_timestamp
  )
`;

module.exports = userSchema;