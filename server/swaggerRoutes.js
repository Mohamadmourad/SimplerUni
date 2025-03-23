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

/**
 * @swagger
 * tags:
 *   name: University
 *   description: University endpoints
 */

/**
 * @swagger
 * /university/createUniversity:
 *   post:
 *     summary: Creates a new university with an admin account.
 *     description: Registers a university and sends login credentials to the admin via email.
 *     tags: [University]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - universityName
 *               - universityEmail
 *               - username
 *             properties:
 *               universityName:
 *                 type: string
 *                 example: "Example University"
 *               universityEmail:
 *                 type: string
 *                 example: "admin@example.edu"
 *               username:
 *                 type: string
 *                 example: "adminUser"
 *     responses:
 *       200:
 *         description: University created successfully.
 *       400:
 *         description: Missing university name.
 */

/**
 * @swagger
 * /university/login:
 *   post:
 *     summary: Logs in a university admin.
 *     tags: [University]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "adminUser"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Wrong credentials.
 */

/**
 * @swagger
 * /university/addDomains:
 *   post:
 *     summary: Adds student and instructor email domains to a university.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentDomain:
 *                 type: string
 *                 example: "students.example.edu"
 *               instructorDomain:
 *                 type: string
 *                 example: "faculty.example.edu"
 *     responses:
 *       200:
 *         description: Domains added successfully.
 */

/**
 * @swagger
 * /university/addCampus:
 *   post:
 *     summary: Adds one or more campuses to the university.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [campus]
 *                 properties:
 *                   campus:
 *                     type: string
 *                     example: "Main Campus"
 *               - type: object
 *                 required: [campususGroup]
 *                 properties:
 *                   campususGroup:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["East Campus", "West Campus"]
 *     responses:
 *       200:
 *         description: Campus or campuses added successfully.
 */

/**
 * @swagger
 * /university/addMajor:
 *   post:
 *     summary: Adds one or more majors to the university.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [major]
 *                 properties:
 *                   major:
 *                     type: string
 *                     example: "Computer Science"
 *               - type: object
 *                 required: [majors]
 *                 properties:
 *                   majors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Math", "Physics"]
 *     responses:
 *       200:
 *         description: Major(s) added successfully.
 */

/**
 * @swagger
 * /university/getUniversity/{universityId}:
 *   get:
 *     summary: Retrieves information about a university.
 *     tags: [University]
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: University info retrieved.
 */

/**
 * @swagger
 * /university/getAllCampsus:
 *   get:
 *     summary: Retrieves all campuses for the logged-in university.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of campuses.
 */

/**
 * @swagger
 * /university/getAllMajors:
 *   get:
 *     summary: Retrieves all majors for the logged-in university.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of majors.
 */

/**
 * @swagger
 * /university/removeCampus:
 *   delete:
 *     summary: Deletes a campus by ID.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campusId
 *             properties:
 *               campusId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Campus deleted.
 *       404:
 *         description: Campus not found.
 */

/**
 * @swagger
 * /university/removeMajor:
 *   delete:
 *     summary: Deletes a major by ID.
 *     tags: [University]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - majorId
 *             properties:
 *               majorId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Major deleted.
 *       404:
 *         description: Major not found.
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin endpoints
 */

/**
 * @swagger
 * /admin/addAdmin:
 *   post:
 *     summary: Adds a new admin to the university.
 *     tags: [Admin]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - password
 *               - roleId
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "jdoe"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123"
 *               roleId:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Admin added successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/updateAdmin:
 *   put:
 *     summary: Updates an existing admin's details.
 *     tags: [Admin]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminToUpdateId
 *               - firstName
 *               - lastName
 *               - roleId
 *             properties:
 *               adminToUpdateId:
 *                 type: integer
 *                 example: 5
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Admin updated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/deleteAdmin:
 *   delete:
 *     summary: Deletes an admin by ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminToDeleteId
 *             properties:
 *               adminToDeleteId:
 *                 type: integer
 *                 example: 8
 *     responses:
 *       200:
 *         description: Admin deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/getAllAdmins:
 *   get:
 *     summary: Retrieves all admins of the university.
 *     tags: [Admin]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin JWT token.
 *     responses:
 *       200:
 *         description: List of admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       adminid:
 *                         type: integer
 *                         example: 1
 *                       firstname:
 *                         type: string
 *                         example: "Ali"
 *                       lastname:
 *                         type: string
 *                         example: "Khan"
 *                       username:
 *                         type: string
 *                         example: "alik"
 *                       rolename:
 *                         type: string
 *                         example: "Editor"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */



/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles endpoints
 */

/**
 * @swagger
 * /role/add:
 *   post:
 *     summary: Adds a new role with associated permissions.
 *     description: Creates a role for a specific university and assigns a set of permissions to it.
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - universityId
 *               - permissions
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Editor"
 *                 description: Name of the new role.
 *               universityId:
 *                 type: integer
 *                 example: 7
 *                 description: ID of the university the role belongs to.
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["edit_posts", "delete_comments"]
 *                 description: List of permissions to assign to the role.
 *     responses:
 *       200:
 *         description: Role created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role created successfully"
 *                 roleId:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Invalid input or missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "wrong parameters"
 *       500:
 *         description: Server error while creating the role.
 */

/**
 * @swagger
 * /role/getRoles:
 *   get:
 *     summary: Retrieves all roles and their permissions for a university.
 *     description: Checks admin authentication and fetches roles with their associated permissions for a given university.
 *     tags: [Roles]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - universityId
 *             properties:
 *               universityId:
 *                 type: integer
 *                 example: 42
 *                 description: ID of the university to fetch roles from.
 *     responses:
 *       200:
 *         description: Successfully retrieved roles and their permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleName:
 *                         type: string
 *                         example: "Admin"
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["manage_users", "edit_courses"]
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error while retrieving roles.
 */
/**
 * @swagger
 * /role/updateRolePermissions:
 *   put:
 *     summary: Updates the permissions assigned to a specific role.
 *     description: Authenticates the admin and replaces all existing permissions for the role with the new list provided.
 *     tags: [Roles]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissions
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 3
 *                 description: The ID of the role to update.
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["edit_users", "view_reports"]
 *                 description: New list of permissions to assign to the role.
 *     responses:
 *       200:
 *         description: Role permissions updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role permissions updated successfully"
 *       400:
 *         description: Missing or invalid roleId or permissions.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /role/checkPermission:
 *   get:
 *     summary: Checks if the admin has a specific permission.
 *     description: Validates the JWT from cookies and verifies if the admin has the requested permission.
 *     tags: [Roles]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permission
 *             properties:
 *               permission:
 *                 type: string
 *                 example: "edit_users"
 *                 description: The permission to check.
 *     responses:
 *       200:
 *         description: Admin has the permission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authorized"
 *       401:
 *         description: Admin is unauthorized or lacks the permission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
/**
 * @swagger
 * /role/deleteRole:
 *   delete:
 *     summary: Deletes a specific role by ID.
 *     description: Authenticates the admin and deletes the specified role if found.
 *     tags: [Roles]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 3
 *                 description: ID of the role to delete.
 *     responses:
 *       200:
 *         description: Role deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role deleted successfully"
 *       400:
 *         description: roleId not provided.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Server error while deleting role.
 */

