/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *               username:
 *                 type: string
 *                 example: user123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User inserted successfully"
 *                 authToken:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 authToken:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/sendOtp:
 *   post:
 *     summary: Sends an OTP to the user's email.
 *     description: Generates an OTP, sets an expiration time, and emails it to the user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailReceiver
 *               - authToken
 *             properties:
 *               emailReceiver:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: The email to receive the OTP.
 *               authToken:
 *                 type: string
 *                 example: "your-jwt-token"
 *                 description: The user's authentication token.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "otpSent"
 *       400:
 *         description: User not found or OTP already sent.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/verifyOtp:
 *   post:
 *     summary: Verifies the OTP entered by the user.
 *     description: Checks if the OTP is correct and not expired.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authToken
 *               - enteredOtp
 *             properties:
 *               authToken:
 *                 type: string
 *                 example: "your-jwt-token"
 *                 description: The user's authentication token.
 *               enteredOtp:
 *                 type: integer
 *                 example: 12345
 *                 description: The OTP entered by the user.
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "otpVerified"
 *       400:
 *         description: OTP is expired, incorrect, or not generated.
 *       500:
 *         description: Internal server error.
 */