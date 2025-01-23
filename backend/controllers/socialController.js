const db = require("../db/connection");

const addNews = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).send("Content is required");
  }

  try {
    // Insert new news record into the database
    const result = await db.query(
      "INSERT INTO news (content, userId) VALUES (?, ?)",
      [content, userId]
    );

    // Send the created news as a response
    res.status(201).json({
      id: result.insertId,
      content,
      userId,
      created_at: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding news");
  }
};

const getNews = async (req, res) => {
  try {
    // Query to fetch news and join with user info
    const result = await db.query(`
        SELECT 
          n.id,
          n.content,
          n.created_at,
          u.id AS userId,
          u.name,
          u.email
        FROM 
          news n
        JOIN 
          users u ON n.userId = u.id
        ORDER BY 
          n.created_at DESC
      `);

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting news");
  }
};
module.exports={addNews,getNews}
