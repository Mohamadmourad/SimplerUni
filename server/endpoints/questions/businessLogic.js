const {db} = require("../../db");
const { verifyToken } = require("../user/helper");

module.exports.addQuestion = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { userId, universityId } = verifyToken(token);
    if (!userId) {
        return res.status(403).json({ error: "Invalid token" });
    }
    const { title, content, tags } = req.body;
    if (!title || !content || !tags) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const result = await db.query(
            `INSERT INTO questions (title, content, tags, userId, universityId)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [title, content, tags, userId, universityId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.getQuestions = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { userId, universityId } = verifyToken(token);
    if (!userId) {
        return res.status(403).json({ error: "Invalid token" });
    }
    const { type } = req.params;
    let orderByClause = "ORDER BY q.created_at DESC";

    if (type === "mostUpvotes") {
        orderByClause = "ORDER BY COUNT(qu.userId) DESC";
    } else if (type === "mostAnswers") {
        orderByClause = "ORDER BY COUNT(qa.answerId) DESC";
    }

    try {
        const query = `
            SELECT 
            q.*,
            u.username,
            u.profilePicture,
            u.userId,
            COUNT(DISTINCT qu.userId) AS upvoteCount,
            COUNT(DISTINCT qa.answerId) AS answerCount,
            CASE 
                WHEN uv.userId IS NOT NULL THEN true
                ELSE false
            END AS hasUpvoted
        FROM questions q
        LEFT JOIN users u ON u.userId = q.userId
        LEFT JOIN question_upvotes qu ON qu.questionId = q.questionId
        LEFT JOIN question_upvotes uv ON uv.questionId = q.questionId AND uv.userId = $2
        LEFT JOIN question_answers qa ON qa.questionId = q.questionId
        WHERE q.universityId = $1
        GROUP BY q.questionId, u.username, u.profilePicture, uv.userId, u.userid
        ${orderByClause};
        `;

        const result = await db.query(query, [universityId, userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.deleteQuestion = async (req, res) => {
    const { questionId } = req.params;
    try {
        const result = await db.query('DELETE FROM questions WHERE questionId = $1 RETURNING *', [questionId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Question not found" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.upvoteQuestion = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { userId, universityId } = verifyToken(token);
    if (!userId) {
        return res.status(403).json({ error: "Invalid token" });
    }
    const { questionId } = req.body;
    if (!questionId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const result = await db.query(
            `INSERT INTO question_upvotes (questionId, userId)
             VALUES ($1, $2)
             RETURNING *`,
            [questionId, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error upvoting question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.removeUpvoteFromQuestion = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { userId } = verifyToken(token);
    if (!userId) {
        return res.status(403).json({ error: "Invalid token" });
    }
    const { questionId } = req.params;
    if (!questionId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const result = await db.query(
            `DELETE FROM question_upvotes
             WHERE questionId = $1 AND userId = $2
             RETURNING *`,
            [questionId, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Upvote not found" });
        }
        res.status(200).json({ message: "Upvote removed", data: result.rows[0] });
    } catch (error) {
        console.error("Error removing upvote:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.answerQuestion = async (req,res)=>{
    const { questionId, content } = req.body;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { userId, universityId } = verifyToken(token);
    if (!userId) {
        return res.status(403).json({ error: "Invalid token" });
    }
    try {
        await db.query('INSERT INTO question_answers (questionId, userId, content) VALUES ($1,$2,$3)', [questionId, userId, content]);
        res.status(200).json("answer added successfully");
    } catch (error) {
        console.error("Error answering question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getAnswersForQuestion = async (req, res) => {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(400).json({ message: 'Missing questionId' });
    }
    try {
      const result = await db.query(`
        SELECT 
            qa.*,
            u.username,
            u.profilePicture,
            u.isstudent
        FROM question_answers qa
        LEFT JOIN users u ON u.userId = qa.userId
        WHERE qa.questionId = $1
        ORDER BY qa.created_at ASC;
      `,[questionId]);
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error getting answers:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
