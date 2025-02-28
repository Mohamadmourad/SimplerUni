const {db} = require("../db");
const { hashText, createToken, handleErrors, compareHashedText } = require("./helper");

module.exports.signup_post = async (req, res) => {
    let { email, password, username } = req.body;
    password = hashText(password);
    try{
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length > 0 && !user.rows[0].isemailverified) {
            return res.status(400).json({
                errors: {
                    email: 'This email is already registered but not verified. Please verify your email.',
                },
            });
        }

        const result = await db.query('INSERT INTO users(username, email, password, isEmailVerified) VALUES ($1,$2,$3,false) RETURNING *',[username,email,password]);

        const authToken = createToken(result.rows[0].userId);

        res.status(200).json({
            message: "user inserted successfully",
            authToken
        });
    }
    catch(e){
        const errors = handleErrors(e);
        console.error(e);
        res.status(400).json({ errors });
    }
};


module.exports.login_post = async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({
                errors: {
                    email: 'That email is not registered.',
                },
            });
        }

        if (!user.rows[0].isemailverified) {
            return res.status(400).json({
                errors: {
                    email: 'Please verify your email before logging in.',
                },
            });
        }

        const isPasswordValid = compareHashedText(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({
                errors: {
                    password: 'Incorrect password.',
                },
            });
        }

        const authToken = createToken(user.rows[0].userId);

        res.status(200).json({
            message: 'Login successful',
            authToken,
        });

    } catch (e) {
        const errors = handleErrors(e);
        console.error(e);
        res.status(400).json({ errors });
    }
};


module.exports.sendOtp = async (req,res)=>{
    console.log("hello test");
    res.status(200).json({message:"request received"})
}

module.exports.verifyOtp = async (req,res)=>{
    console.log("hello test");
    res.status(200).json({message:"request received"})
}