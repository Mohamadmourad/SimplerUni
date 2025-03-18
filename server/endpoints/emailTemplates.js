export const accountAcceptanceEmail = (serialNumber, originalPassword) => `
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
                <p class="info">Serial Number: ${serialNumber}</p>
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

export const otpVerificationEmail = (otp) => `
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

