const {db} = require("../db");
const {DateTime} = require("luxon");
const { hashText, createToken, handleErrors, compareHashedText, sendEmail, getUserIdFromToken } = require("./helper");

module.exports.signup_post = async (req, res) => {
    let { email, password, username } = req.body;
    password = await hashText(password);
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
        const authToken = createToken(result.rows[0].userid);

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

module.exports.sendOtp = async (req, res) => {
    try {
        const { emailReceiver, authToken } = req.body;
        console.log(authToken)
        const userId = getUserIdFromToken(authToken);
        console.log(userId);
        const result = await db.query(`SELECT emailOtpExpire FROM users WHERE userId = $1`, [userId]);
        if (result.rowCount === 0) {
            return res.status(400).json({ message: "userNotFound" });
        }
        const emailOtpExpire = result.rows[0].emailotpexpire;
        const now = DateTime.utc();

        if (emailOtpExpire) {
            const expireTime = DateTime.fromISO(emailOtpExpire, { zone: 'utc' });
            if (expireTime > now) {
                const minutesLeft = Math.ceil(expireTime.diff(now, 'minutes').minutes);
                return res.status(400).json({ 
                    message: "otpAlreadySent", 
                    minutesLeft 
                });
            }
        }
        const otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const subject = "Email Verification";
        const expireAt = now.plus({ minutes: 3 }).toISO();
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>OTP Verification</title>
            <style>
            body { margin: 0; padding: 0; background-color: #030712; font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
            .header { background-color: #6d28d9; padding: 20px; text-align: center; color: #ffffff; }
            .content { padding: 30px 20px; color: #030712; text-align: center; }
            .otp-code { display: inline-block; font-weight: bold; font-size: 24px; color: #6d28d9; margin: 20px 0; }
            .footer { background-color: #6d28d9; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
            a.button { background-color: #6d28d9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block; margin-top: 20px; }
            a.button:hover { opacity: 0.9; }
            </style>
        </head>
        <body>
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="header">
                <h1>Verify Your Account</h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                <p>Hello,</p>
                <p>Please use the OTP code below to complete your verification process:</p>
                <div class="otp-code">${otp}</div>
                <p>
                    If you didn't request this verification code, you can safely ignore this email.
                </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                <p>© 2025 Your Company. All rights reserved.</p>
                </td>
            </tr>
            </table>
        </body>
        </html>
        `;
        await sendEmail(emailReceiver, subject, htmlContent);
        await db.query(`UPDATE users SET emailOtp = $1, emailOtpExpire = $2 WHERE userId = $3`, [otp, expireAt, userId]);
        res.status(200).json({ message: "otpSent" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "internalServerError" });
    }
};


module.exports.verifyOtp = async (req, res) => {
    try {
        const { authToken, enteredOtp } = req.body;
        const userId = getUserIdFromToken(authToken);

        const result = await db.query(`SELECT emailOtp, emailOtpExpire FROM users WHERE userId = $1`, [userId]);
        if (result.rowCount === 0) {
            return res.status(400).json({ message: "userNotFound" });
        }

        const { emailotp, emailotpexpire } = result.rows[0];
        const now = DateTime.utc();

        if (!emailotp || !emailotpexpire) {
            return res.status(400).json({ message: "otpNotGenerated" });
        }

        const expireTime = DateTime.fromISO(emailotpexpire, { zone: 'utc' });
        if (now > expireTime) {
            return res.status(400).json({ message: "otpExpired" });
        }
        if (emailotp !== parseInt(enteredOtp, 10)) {
            return res.status(400).json({ message: "invalidOtp" });
        }

        await db.query(`UPDATE users SET emailOtp = NULL, emailOtpExpire = NULL, isEmailVerified = true WHERE userId = $1`, [userId]);

        res.status(200).json({ message: "otpVerified" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "internalServerError" });
    }
};