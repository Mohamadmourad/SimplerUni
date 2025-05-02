/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Signs up a new user.
 *     description: Registers a new user with their email, password, and username. If the email is already registered, an error is returned.
 *     tags: [User]
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               username:
 *                 type: string
 *                 example: "newuser"
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Email already registered or other validation errors.
 */

/**
 * @swagger
 * /user/addAdditionalUserData:
 *   post:
 *     summary: Adds additional user data such as major, campus, and optional bio.
 *     description: Updates user information with additional data, including major, campus, and optional bio. Requires a valid auth token in the Authorization header (without "Bearer" prefix).
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - majorId
 *               - campusId
 *             properties:
 *               majorId:
 *                 type: integer
 *                 example: 101
 *               campusId:
 *                 type: integer
 *                 example: 10
 *               optionalData:
 *                 type: object
 *                 properties:
 *                   bio:
 *                     type: string
 *                     example: "A passionate student of computer science."
 *     responses:
 *       200:
 *         description: Additional user data added successfully.
 *       400:
 *         description: Authorization missing or invalid data.
 *       500:
 *         description: Error while adding additional data.
 */


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Logs in a user.
 *     description: Authenticates a user with email and password. Returns an auth token if successful.
 *     tags: [User]
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns auth token.
 *       400:
 *         description: Invalid email or password.
 *       204:
 *         description: Required field (major/campus) missing.
 */

/**
 * @swagger
 * /user/sendOtp:
 *   post:
 *     summary: Sends an OTP to the user's email for verification.
 *     description: Sends a one-time password (OTP) to the user’s email for email verification.
 *     tags: [User]
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
 *               authToken:
 *                 type: string
 *                 example: "auth-token-123"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: OTP already sent or other errors.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /user/verifyOtp:
 *   post:
 *     summary: Verifies the OTP entered by the user.
 *     description: Validates the OTP entered by the user to confirm their email verification.
 *     tags: [User]
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
 *                 example: "auth-token-123"
 *               enteredOtp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid OTP or OTP expired.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /user/getUser:
 *   get:
 *     summary: Retrieves the authenticated user's information.
 *     description: Returns user data for the user identified by the JWT token in the Authorization header. Requires a valid token (without the "Bearer" prefix).
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 # You can add other user fields here as needed
 *       400:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /user/getAllInstructors:
 *   get:
 *     summary: Fetch all instructors of a university.
 *     description: Retrieves a list of all instructors associated with the university of the logged-in admin.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of instructors fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   universityId:
 *                     type: integer
 *                   isStudent:
 *                     type: boolean
 *       401:
 *         description: Unauthorized request.
 *       500:
 *         description: Failed to fetch instructors.
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
 * /admin/getAdmin:
 *   get:
 *     summary: Retrieves the authenticated admin's details.
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
 *         description: Successfully retrieved admin details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   type: object
 *                   properties:
 *                     adminid:
 *                       type: integer
 *                       example: 1
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     username:
 *                       type: string
 *                       example: "jdoe"
 *                     rolename:
 *                       type: string
 *                       example: "Super Admin"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["manage_users", "edit_content"]
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
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

/**
 * @swagger
 * /chat/getUserChatrooms:
 *   get:
 *     summary: Retrieves the chatrooms of the authenticated user.
 *     description: Returns a list of chatrooms for the user identified by the JWT token in the Authorization header. Requires a valid token (without the "Bearer" prefix).
 *     tags: [Chat]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     responses:
 *       200:
 *         description: Successfully retrieved user chatrooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chatroomid:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Study Group"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-07T10:00:00Z"
 *       401:
 *         description: Authorization header missing.
 *       403:
 *         description: Invalid token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /chat/sendMessage:
 *   post:
 *     summary: Sends a message to a chatroom.
 *     description: Sends a message with a specific type and content to the specified chatroom, using the JWT token in the Authorization header to authenticate the user. If the user sent a message within the last 5 minutes, they will be rate-limited.
 *     tags: [Chat]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *       - in: body
 *         name: message
 *         required: true
 *         description: The message content to send.
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "text"
 *             content:
 *               type: string
 *               example: "Hello, this is a message."
 *             chatroomId:
 *               type: UUID
 *               example: 1
 *     responses:
 *       200:
 *         description: Successfully sent the message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully."
 *       429:
 *         description: Rate limit exceeded. You need to wait before sending another message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You can’t send a message yet. Time left: 4m 30s"
 *                 minutes:
 *                   type: integer
 *                   example: 4
 *                 seconds:
 *                   type: integer
 *                   example: 30
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /questions/getQuestions/{type}:
 *   get:
 *     summary: Get a list of questions by type.
 *     description: Returns a list of questions based on the sort type (e.g., mostUpvotes, mostAnswers). Requires authentication.
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [latest, mostUpvotes, mostAnswers]
 *         description: Type of sorting to apply.
 *     responses:
 *       200:
 *         description: Successfully retrieved questions.
 *       401:
 *         description: Authorization header missing.
 *       403:
 *         description: Invalid token.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /questions/getAnswers/{questionId}:
 *   get:
 *     summary: Get all answers for a question.
 *     description: Returns all answers associated with a specific question, including the answering user's username and profile picture.
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question to retrieve answers for.
 *     responses:
 *       200:
 *         description: List of answers retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   answerId:
 *                     type: string
 *                   questionId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   username:
 *                     type: string
 *                   profilePicture:
 *                     type: string
 *       400:
 *         description: Missing questionId.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /questions/addQuestion:
 *   post:
 *     summary: Add a new question.
 *     description: Creates a new question with the provided title, content, and tags. Requires a valid JWT token in the Authorization header.
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *       - in: body
 *         name: question
 *         required: true
 *         description: The question details.
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             content:
 *               type: string
 *             tags:
 *               type: string
 *     responses:
 *       201:
 *         description: Question created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Authorization header missing.
 *       403:
 *         description: Invalid token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /questions/upvoteQuestion:
 *   post:
 *     summary: Upvote a question.
 *     description: Upvotes a question by the authenticated user.
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token (without the "Bearer" prefix).
 *       - in: body
 *         name: upvote
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             questionId:
 *               type: string
 *         description: ID of the question to upvote.
 *     responses:
 *       201:
 *         description: Upvote successful.
 *       400:
 *         description: Missing questionId.
 *       401:
 *         description: Authorization header missing.
 *       403:
 *         description: Invalid token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /questions/answerQuestion:
 *   post:
 *     summary: Answer a question.
 *     description: Submits an answer to a question. Requires user authentication.
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token (without the "Bearer" prefix).
 *       - in: body
 *         name: answer
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             questionId:
 *               type: string
 *             content:
 *               type: string
 *     responses:
 *       200:
 *         description: Answer added successfully.
 *       401:
 *         description: Authorization header missing.
 *       403:
 *         description: Invalid token.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /questions/deleteQuestion/{questionId}:
 *   delete:
 *     summary: Delete a question by ID.
 *     description: Deletes the question identified by its ID.
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question to delete.
 *     responses:
 *       200:
 *         description: Question deleted successfully.
 *       404:
 *         description: Question not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /questions/removeUpvoteFromQuestion/{questionId}:
 *   delete:
 *     summary: Remove an upvote from a question.
 *     description: Removes an upvote from a question by the authenticated user.
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token (without the "Bearer" prefix).
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question to remove the upvote from.
 *     responses:
 *       200:
 *         description: Upvote removed successfully.
 *       400:
 *         description: Missing questionId.
 *       401:
 *         description: Authorization header missing.
 *       403:
 *         description: Invalid token.
 *       404:
 *         description: Upvote not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /clubs/underReviewClubs:
 *   get:
 *     summary: Get all under review clubs.
 *     description: Returns all clubs that are under review and belong to the authenticated university.
 *     tags: [Clubs]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     responses:
 *       200:
 *         description: List of under review clubs.
 *       500:
 *         description: Failed to fetch under review clubs.
 */

/**
 * @swagger
 * /clubs/acceptedClubs:
 *   get:
 *     summary: Get all accepted clubs.
 *     description: Returns all accepted clubs for the authenticated university.
 *     tags: [Clubs]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     responses:
 *       200:
 *         description: List of accepted clubs.
 *       500:
 *         description: Failed to fetch accepted clubs.
 */

/**
 * @swagger
 * /clubs/getClubsUserNotIn:
 *   get:
 *     summary: Get clubs the user is not a member of.
 *     description: Returns a list of clubs that the user is not currently part of.
 *     tags: [Clubs]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for user authentication.
 *     responses:
 *       200:
 *         description: List of clubs user is not in.
 *       500:
 *         description: Failed to fetch clubs.
 */

/**
 * @swagger
 * /clubs/getClubsUserIsIn:
 *   get:
 *     summary: Get clubs the user is a member of.
 *     description: Returns all clubs the user is currently a member of.
 *     tags: [Clubs]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for user authentication.
 *     responses:
 *       200:
 *         description: List of clubs user is in.
 *       500:
 *         description: Failed to fetch clubs.
 */
/**
 * @swagger
 * /clubs/getAdminClubList:
 *   get:
 *     summary: Fetch a list of clubs managed by the admin.
 *     description: Retrieves a list of clubs where the logged-in user is the admin, filtered by their university.
 *     tags: [Clubs]
 *     responses:
 *       200:
 *         description: List of clubs fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clubId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   adminId:
 *                     type: integer
 *                   universityId:
 *                     type: integer
 *       401:
 *         description: Unauthorized request.
 *       500:
 *         description: Failed to fetch admin clubs.
 */
/**
 * @swagger
 * /clubs/getClubMembers/{clubId}:
 *   get:
 *     summary: Fetch members of a specific club.
 *     description: Retrieves a list of users who are members of the specified club.
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the club.
 *     responses:
 *       200:
 *         description: Club members fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       400:
 *         description: Missing or invalid clubId.
 *       500:
 *         description: Failed to get club members.
 */


/**
 * @swagger
 * /clubs/makeClubRequest:
 *   post:
 *     summary: Request to create a club.
 *     description: Allows a user to send a request to create a club. Requires user authentication.
 *     tags: [Clubs]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token (without the "Bearer" prefix).
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Club details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Club request submitted successfully.
 *       401:
 *         description: Authorization header missing.
 *       500:
 *         description: Creating club failed.
 */

/**
 * @swagger
 * /clubs/acceptClubRequest:
 *   post:
 *     summary: Accept a club creation request.
 *     description: Allows an admin to accept a club creation request and finalize the club setup.
 *     tags: [Clubs]
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for admin authentication.
 *     requestBody:
 *       description: Club data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clubId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               room:
 *                 type: string
 *               adminId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Club updated successfully.
 *       400:
 *         description: Club ID is required.
 *       500:
 *         description: Updating club failed.
 */

/**
 * @swagger
 * /clubs/requestJoinClub:
 *   post:
 *     summary: Request to join a club.
 *     description: Allows a user to request membership in a specific club.
 *     tags: [Clubs]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for user authentication.
 *     requestBody:
 *       description: Club membership request data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatroomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Join request sent successfully.
 *       401:
 *         description: Authorization header missing.
 *       500:
 *         description: Creating club failed.
 */

/**
 * @swagger
 * /clubs/acceptJoinRequest:
 *   post:
 *     summary: Accept a club join request.
 *     description: Allows an admin to accept a user’s request to join a club.
 *     tags: [Clubs]
 *     requestBody:
 *       description: Membership acceptance info
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               chatroomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Join request accepted successfully.
 *       400:
 *         description: Missing userId or chatroomId.
 *       500:
 *         description: Accepting join request failed.
 */

/**
 * @swagger
 * /clubs/rejectJoinRequest:
 *   post:
 *     summary: Reject a club join request.
 *     description: Allows an admin to reject a user’s request to join a club.
 *     tags: [Clubs]
 *     requestBody:
 *       description: Membership rejection info
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               chatroomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Join request rejected successfully.
 *       400:
 *         description: Missing userId or chatroomId.
 *       500:
 *         description: Rejecting join request failed.
 */

/**
 * @swagger
 * /clubs/removerStudentFromClub/{clubId}/{userId}:
 *   delete:
 *     summary: Remove a student from a club.
 *     description: Deletes a student from a club and their associated chatroom.
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the club.
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to remove.
 *     responses:
 *       200:
 *         description: Student removed successfully.
 *       400:
 *         description: Missing or invalid parameters.
 *       500:
 *         description: Failed to remove the student.
 */

/**
 * @swagger
 * /clubs/changeClubAdmin:
 *   put:
 *     summary: Change the admin of a club.
 *     description: Updates the admin of a specified club to a new user.
 *     tags: [Clubs]
 *     requestBody:
 *       description: Information about the new admin and the club.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newAdminId:
 *                 type: integer
 *               clubId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Admin changed successfully.
 *       400:
 *         description: Missing or invalid body parameters.
 *       500:
 *         description: Failed to change admin.
 */
