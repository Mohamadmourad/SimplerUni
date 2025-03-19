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
        username VARCHAR(100) UNIQUE, 
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        isEmailVerified BOOLEAN,
        emailOtp INTEGER,
        emailOtpExpire VARCHAR(30),
        passwordResetToken VARCHAR(255),
        type VARCHAR(30),
        major VARCHAR(255),
        description VARCHAR(255),
        profilePicture VARCHAR(255),
        startingUniYear VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT now()
    );`
    },
    {
        name:"chatrooms",
        schema:`CREATE TABLE chatrooms (
        chatroomId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"chatroom_members",
        schema:`CREATE TABLE chatroom_members (
        chatroomId UUID REFERENCES chatrooms(chatroomId) ON DELETE CASCADE,
        userId UUID REFERENCES users(userId) ON DELETE CASCADE
        );`
    },
    {
        name:"mesages",
        schema:`CREATE TABLE mesages (
        messageId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        type VARCHAR(40),
        content TEXT,
        chatroomId UUID REFERENCES chatrooms(chatroomId) ON DELETE CASCADE,
        userId UUID REFERENCES users(userId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"clubs",
        schema:`CREATE TABLE clubs (
        clubId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(40),
        description TEXT,
        room VARCHAR(20),
        status VARCHAR(30),
        adminId UUID REFERENCES users(userId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"club_members",
        schema:`CREATE TABLE club_members (
        clubId UUID REFERENCES clubs(clubId) ON DELETE CASCADE,
        userId UUID REFERENCES users(userId) ON DELETE CASCADE
        );`
    },
    {
        name:"quizes",
        schema:`CREATE TABLE quizes (
        quizId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content VARCHAR(40),
        course VARCHAR(30),
        tag VARCHAR(20),
        userId UUID REFERENCES users(userId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"questions",
        schema:`CREATE TABLE questions (
        questionId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content VARCHAR(40),
        tags VARCHAR(120),
        userId UUID REFERENCES users(userId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"question_answers",
        schema:`CREATE TABLE question_answers (
        answerId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content VARCHAR(40),
        userId UUID REFERENCES users(userId) ON DELETE CASCADE,
        questionId UUID REFERENCES questions(questionId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"question_upvotes",
        schema:`CREATE TABLE question_upvotes (
        questionId UUID REFERENCES questions(questionId) ON DELETE CASCADE,
        userId UUID REFERENCES users(userId) ON DELETE CASCADE
        );`
    },
    {
        name:"universities",
        schema:`CREATE TABLE universities (
        universityId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(60),
        studentDomain VARCHAR(255),
        instructorDomain VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT now()
        );
        ALTER TABLE users ADD COLUMN universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL;
        ALTER TABLE questions ADD COLUMN universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL;
        ALTER TABLE quizes ADD COLUMN universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL;
        ALTER TABLE clubs ADD COLUMN universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL;
        ALTER TABLE chatrooms ADD COLUMN universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL;
        `
    },
    {
        name: "roles",
        schema:`CREATE TABLE roles (
        roleId UUID REFERENCES questions(questionId) ON DELETE CASCADE,
        name varchar(32),
        password VARCHAR(255),
        universityId UUID REFERENCES universities(universityId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name: "role_permissions",
        schema:`CREATE TABLE role_permissions (
        name varchar(32),
        universityId UUID REFERENCES universities(universityId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name: "web_admins",
        schema:`CREATE TABLE web_admins (
        adminId UUID REFERENCES questions(questionId) ON DELETE CASCADE,
        username varchar(32),
        password VARCHAR(255),
        universityId UUID REFERENCES universities(universityId) ON DELETE CASCADE,
        roleId UUID REFERENCES roles(roleId) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now()
        );`
    },
    {
        name:"campusus",
        schema:`CREATE TABLE campusus (
        campusId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(60),
        universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL
        );
        ALTER TABLE users ADD COLUMN campusId UUID REFERENCES campusus(campusId) ON DELETE SET NULL;
        `
    },
    {
        name:"majors",
        schema:`CREATE TABLE majors (
        majorId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(60),
        campusId UUID REFERENCES campusus(campusId) ON DELETE SET NULL
        );`
    },
    {
        name:"news",
        schema:`CREATE TABLE news (
        newsId UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content VARCHAR(60),
        imageUrl VARCHAR(255),
        universityId UUID REFERENCES universities(universityId) ON DELETE SET NULL
        );`
    },
]

module.exports = {
    db,
    createTables,
};