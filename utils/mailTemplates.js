exports.signUpTemplate = (verifyLink, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to StateStreet</title>
        <style>
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: #f0f8ff;
                margin: 0;
                padding: 0;
                color: #222;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0, 123, 255, 0.08);
                overflow: hidden;
                border: 1px solid #e3f0fc;
            }
            .header {
                background: linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%);
                color: #fff;
                padding: 32px 0 24px 0;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 2.2em;
                letter-spacing: 2px;
                font-weight: 700;
            }
            .content {
                padding: 32px 28px 24px 28px;
                background: #f7fbff;
            }
            .content p {
                font-size: 1.08em;
                margin: 18px 0;
                color: #222;
            }
            .button-container {
                text-align: center;
                margin: 32px 0 24px 0;
            }
            .button {
                background: linear-gradient(90deg, #42a5f5 0%, #1976d2 100%);
                color: #fff;
                padding: 16px 36px;
                font-size: 1.1em;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.12);
                transition: background 0.2s;
                display: inline-block;
            }
            .button:hover {
                background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
            }
            .footer {
                background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);      
                color: #fff;
                text-align: center;
                padding: 18px 0;
                font-size: 0.98em;
                border-top: 1px solid #b3e0fc;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                .content {
                    padding: 18px 10px 16px 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>StateStreet</h1>
            </div>
            <div class="content">
                <p>Hi <strong>${firstName}</strong>,</p>
                <p>Thank you for joining <b>StateStreet</b> We're thrilled to have you as part of our community.</p>
                <p>To complete your registration, please verify your account by clicking the button below:</p>
                <div class="button-container">
                    <a href="${verifyLink}" class="button">Verify My Account</a>
                </div>
                <p>If you did not sign up for StateStreet, please ignore this email.</p>
                <p>Warm regards,<br>The StateStreet Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} StateStreet. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};



exports.forgotTemplate = (verifyLink, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StateStreet</title>
        <style>
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: #f0f8ff;
                margin: 0;
                padding: 0;
                color: #222;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0, 123, 255, 0.08);
                overflow: hidden;
                border: 1px solid #e3f0fc;
            }
            .header {
                background: linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%);
                color: #fff;
                padding: 32px 0 24px 0;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 2.2em;
                letter-spacing: 2px;
                font-weight: 700;
            }
            .content {
                padding: 32px 28px 24px 28px;
                background: #f7fbff;
            }
            .content p {
                font-size: 1.08em;
                margin: 18px 0;
                color: #222;
            }
            .button-container {
                text-align: center;
                margin: 32px 0 24px 0;
            }
            .button {
                background: linear-gradient(90deg, #42a5f5 0%, #1976d2 100%);
                color: #fff;
                padding: 16px 36px;
                font-size: 1.1em;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.12);
                transition: background 0.2s;
                display: inline-block;
            }
            .button:hover {
                background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
            }
            .footer {
                background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
                color: #fff;
                text-align: center;
                padding: 18px 0;
                font-size: 0.98em;
                border-top: 1px solid #b3e0fc;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                .content {
                    padding: 18px 10px 16px 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>StateStreet</h1>
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>You performed an action in adhere to forgetting your password.</p>
                <p>Please click the button below:</p>
                <div class="button-container">
                    <a href="${verifyLink}" class="button">reset My password</a>
                </div>
                <p>If you did not perform this action up on our platform, kindly ignore this email.</p>
                <p>Best regards,<br>StateStreet</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} StateStreet. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};
