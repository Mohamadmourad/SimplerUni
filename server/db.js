const {Client} = require('pg');
require('dotenv').config();

const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

const checkTableExists = async (tableName)=>{
    try {
        const query = `
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.tables 
                WHERE table_name = $1
            );
        `;
        const res = await db.query(query, [tableName]);
        return res.rows[0].exists;
    } catch (err) {
        console.error('Error checking table existence:', err);
        return false;
    }
}

const createTables = async ()=>{
  tables.forEach(async (table)=>{
    if(await checkTableExists(table.name)){
        console.log(`Table ${table.name} is already created`);
    }
    else{
        try {
            await db.query(table.schema);
            console.log(`Table ${table.name} has been created successfully`);
        } catch (err) {
            console.error(`Error creating table ${table.name}:`, err);
        }
    }
  })
}

const tables =
[
    {
        name: "users",
        schema:`CREATE TABLE users (
         userId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
         name VARCHAR(100), 
         email VARCHAR(100) UNIQUE
        );`
    },
    {
        name:"test",
        schema:"CREATE TABLE test (id SERIAL PRIMARY KEY, total_price DECIMAL);"
    }
]

module.exports = {
    db,
    createTables,
};