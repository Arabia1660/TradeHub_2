const db = require("../db/connection");

const createUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Fields are required");
  }

  // Insert the user into the database
  db.query(
    `INSERT INTO users (name, email, password)
     VALUES (?, ?, ?)`,
    [name, email, password],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error creating user");
      }

      // Retrieve the inserted row based on the newly generated ID
      const insertedId = results.insertId;
      db.query(
        `SELECT * FROM users WHERE id = ?`,
        [insertedId],
        (err, userResults) => {
          if (err) {
            return res.status(500).send("Error retrieving inserted user");
          }

          // Respond with the inserted user's details
          res.json(userResults[0]); // Return the first row of the results
        }
      );
    }
  );
};
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Find the user in the database
  db.query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    async (err, results) => {
      if (err) {
        return res.status(500).send("Error retrieving user");
      }

      if (results.length === 0) {
        return res.status(401).send("Invalid email or password");
      }

      const user = results[0];
      res.json(user);
    }
  );
};
const updateUser = async (req, res) => {
  const { name, company, email, address, password } = req.body;
  const user = req.user;
  if (!name || !email || !password)
    return req.status(404).send("Fields are required");

  try {
    const query = `
      UPDATE users 
      SET 
        name = ?, 
        email = ?, 
        password = ?, 
        company = ?, 
        address = ?
      WHERE id = ?
    `;

    const values = [name, email, password, company, address, user.id];
    await db.query(query, values);
    const result=await db.query("SELECT * FROM users WHERE id = ?",[user.id])
    res.json(result[0])
  } catch (error) {
    res.status(500).send("Error");
  }
};
const getUserSummary = async (req, res) => {
  const userId = req.user.id; // Get userId from the authenticated user

  try {
    // 1. Total Profit Calculation
    const totalProfitQuery = `
      SELECT 
        COALESCE(SUM(
          (CASE WHEN t.transaction_type = 'sell' THEN t.quantity * t.price ELSE 0 END) - 
          (CASE WHEN t.transaction_type = 'buy' THEN t.quantity * t.price ELSE 0 END)
        ), 0) AS totalProfit
      FROM transactions t
      LEFT JOIN investments i ON t.user_id = i.user_id AND t.stock_symbol = i.stock_symbol
      WHERE t.user_id = ?;
    `;
    const [totalProfitResult] = await db.query(totalProfitQuery, [userId]);
    const totalProfit = totalProfitResult.totalProfit || 0;

    // 2. Total Investment Calculation
    const totalInvestQuery = `
      SELECT 
        COALESCE(SUM(quantity * buy_price), 0) AS totalInvest
      FROM investments 
      WHERE user_id = ?;
    `;
    const [totalInvestResult] = await db.query(totalInvestQuery, [userId]);
    const totalInvest = totalInvestResult.totalInvest || 0;

    // 3. Total Deposit Calculation
    const totalDepositQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) AS totalDeposit 
      FROM deposit 
      WHERE userId = ? AND status = 'ACCEPTED';
    `;
    const [totalDepositResult] = await db.query(totalDepositQuery, [userId]);
    const totalDeposit = totalDepositResult.totalDeposit || 0;

    // 4. Total Withdraw Calculation
    const totalWithdrawQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) AS totalWithdraw 
      FROM withdraw 
      WHERE userId = ? AND status = 'ACCEPTED';
    `;
    const [totalWithdrawResult] = await db.query(totalWithdrawQuery, [userId]);
    const totalWithdraw = totalWithdrawResult.totalWithdraw || 0;

    // 5. Last 15 Days Profit Calculation
    const last15DaysProfitQuery = `
      SELECT 
        DATE(t.created_at) AS day, 
        COALESCE(SUM(
          (CASE WHEN t.transaction_type = 'sell' THEN t.quantity * t.price ELSE 0 END) - 
          (CASE WHEN t.transaction_type = 'buy' THEN t.quantity * t.price ELSE 0 END)
        ), 0) AS profit
      FROM transactions t
      LEFT JOIN investments i ON t.user_id = i.user_id AND t.stock_symbol = i.stock_symbol
      WHERE t.user_id = ? 
        AND t.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY)
      GROUP BY DATE(t.created_at)
      ORDER BY DATE(t.created_at) ASC;
    `;
    const last15DaysProfitResult = await db.query(last15DaysProfitQuery, [userId]);

    // Format the profit result to be an array of objects like [{day: '2024-12-12', profit: 30.00}, ...]
    const last15DaysProfit = last15DaysProfitResult.map(row => ({
      day: row.day,
      profit: parseFloat(row.profit).toFixed(2)
    }));

    // Final Response
    res.json({
      totalProfit: parseFloat(totalProfit).toFixed(2),
      totalInvest: parseFloat(totalInvest).toFixed(2),
      totalDeposit: parseFloat(totalDeposit).toFixed(2),
      totalWithdraw: parseFloat(totalWithdraw).toFixed(2),
      last15DaysProfit
    });

  } catch (error) {
    console.error("Error fetching user summary:", error);
    res.status(500).json({ message: "An error occurred while fetching user summary" });
  }
};


module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUserSummary
};
