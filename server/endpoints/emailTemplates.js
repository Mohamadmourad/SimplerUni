const accountAcceptanceEmail = (username, originalPassword) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Account Acceptance</title>
        <style>
        body { margin: 0; padding: 0; background-color: #030712; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
        .header { background-color: #6d28d9; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px 20px; color: #030712; text-align: center; }
        .congrats { 
            display: inline-block;
            font-weight: bold;
            font-size: 24px;
            color: #6d28d9;
            margin: 20px 0;
        }
        .info { 
            font-size: 16px;
            color: #030712;
            margin: 10px 0;
        }
        .footer { background-color: #6d28d9; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
        </style>
    </head>
    <body>
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
                <h1>Account Accepted</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <div class="congrats">Congrats, you have been accepted to SimplerUni!</div>
                <p class="info">username: ${username}</p>
                <p class="info">Password: ${originalPassword}</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
                <p>© 2025 SimplerUni. All rights reserved.</p>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;

const otpVerificationEmail = (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
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

const newUniversityRequestEmail = (name, email, phoneNumber, additionalInfo) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>New University Request</title>
        <style>
        body { margin: 0; padding: 0; background-color: #030712; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
        .header { background-color: #6d28d9; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px 20px; color: #030712; text-align: center; }
        .info { background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: left; margin: 20px 0; }
        .footer { background-color: #6d28d9; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
        a.button { background-color: #6d28d9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block; margin-top: 20px; }
        a.button:hover { opacity: 0.9; }
        </style>
    </head>
    <body>
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
            <h1>New University Request</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
            <p>Hello,</p>
            <p>A new university request has been submitted with the following details:</p>
            <div class="info">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Additional Information:</strong> ${additionalInfo || "N/A"}</p>
            </div>
            <p>Please review the request as soon as possible.</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
            <p>© 2025 simplerUni. All rights reserved.</p>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;

const clubAcceptanceEmail = (username, clubName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to the Club</title>
        <style>
        body { margin: 0; padding: 0; background-color: #f0f4f8; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
        .header { background-color: #10b981; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px 20px; color: #030712; text-align: center; }
        .footer { background-color: #10b981; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
        </style>
    </head>
    <body>
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
            <h1>Welcome to the Club, ${username}!</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
            <p>Congratulations!</p>
            <p>We're thrilled to inform you that your application to join the club ${clubName} has been accepted. We're excited to have you on board and can't wait for you to be part of our amazing community.</p>
            <p>Stay tuned for upcoming events and updates. If you have any questions, feel free to reach out to us.</p>
            <p>Welcome aboard!</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
            <p>© 2025 Csimpleruni. All rights reserved.</p>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;

const clubRejectionEmail = (username, clubName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Club Application Status</title>
        <style>
        body { margin: 0; padding: 0; background-color: #f0f4f8; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
        .header { background-color: #ef4444; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px 20px; color: #030712; text-align: center; }
        .footer { background-color: #ef4444; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
        </style>
    </head>
    <body>
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
            <h1>Dear ${username},</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
            <p>Thank you for your interest in joining our club ${clubName}</p>
            <p>After careful consideration, we regret to inform you that your application was not successful at this time.</p>
            <p>We encourage you to stay engaged and consider reapplying in the future. Your enthusiasm is appreciated, and we hope to see your name again.</p>
            <p>Best wishes in all your endeavors.</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
            <p>© 2025 simplerUni. All rights reserved.</p>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;

const resetPasswordEmail = (username, resetToken) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reset Your Password</title>
        <style>
        body { margin: 0; padding: 0; background-color: #030712; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
        .header { background-color: #6d28d9; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px 20px; color: #030712; text-align: center; }
        .message { font-size: 16px; margin: 20px 0; }
        .footer { background-color: #6d28d9; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
        a.button { background-color: #6d28d9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block; margin-top: 20px; }
        a.button:hover { opacity: 0.9; }
        </style>
    </head>
    <body>
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
                <h1>Password Reset Request</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <p>Hello ${username},</p>
                <p class="message">
                    We received a request to reset your password. Please click the button below to reset your password:
                </p>
                <a href="https://simpleruni.com/user/reset-password/${resetToken}" class="button">Reset Password</a>
                <p class="message">
                    If you didn't request this, please ignore this email or contact support if you have questions.
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

const adminResetPasswordEmail = (username, resetToken) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reset Your Password</title>
        <style>
        body { margin: 0; padding: 0; background-color: #030712; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
        .header { background-color: #6d28d9; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px 20px; color: #030712; text-align: center; }
        .message { font-size: 16px; margin: 20px 0; }
        .footer { background-color: #6d28d9; padding: 15px; text-align: center; color: #ffffff; font-size: 14px; }
        a.button { background-color: #6d28d9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block; margin-top: 20px; }
        a.button:hover { opacity: 0.9; }
        </style>
    </head>
    <body>
        <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
                <h1>Password Reset Request</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <p class="message">
                    We received a request to reset password of the admin ${username}. Please click the button below to reset your password:
                </p>
                <a href="https://simpleruni.com/admin/reset-password/${resetToken}" class="button">Reset Password</a>
                <p class="message">
                    If you didn't request this, please ignore this email or contact support if you have questions.
                </p>
            </td>
        </tr>
        <tr>
            <td class="footer">
                <p>© 2025 simplerUni. All rights reserved.</p>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;

module.exports = { accountAcceptanceEmail, otpVerificationEmail, newUniversityRequestEmail, clubAcceptanceEmail, clubRejectionEmail };
