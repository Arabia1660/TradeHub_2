const db = require("../db/connection");

const addBank = async (req, res) => {
  const { method, account } = req.body;
  if (!method || !account) {
    return res.status(404).send("Fields are required");
  }
  try {
    const result = await db.query(
      "INSERT INTO banks (method,account) VALUES (?,?)",
      [method, account]
    );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getBanks = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM banks ORDER BY created_at DESC"
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const deleteBank = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Fields are required");
  }

  try {
    const result = await db.query("DELETE FROM banks WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Bank not found");
    }

    res.status(200).json({ message: "Bank deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const createDeposit = async (req, res) => {
  const { tnx_id, amount, bankId } = req.body;
  const user = req.user;

  if (!tnx_id || !amount || !bankId) {
    return res.status(400).send("Fields are required");
  }

  try {
    // Insert new deposit record into the database
    const result = await db.query(
      "INSERT INTO deposit (tnx_id, amount, bankId,userId) VALUES (?, ?, ?,?)",
      [tnx_id, amount, bankId,user.id]
    );

    // Send the created deposit as a response
    res.status(201).json({
      id: result.insertId,
      tnx_id,
      amount,
      status: "PENDING",
      bankId,
      created_at: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
const createWithdraw = async (req, res) => {
  const { account_no, amount, bankId } = req.body;
  const user = req.user;

  if (!account_no || !amount || !bankId) {
    return res.status(400).send("Fields are required");
  }

  if (amount > user.balance) {
    return res.status(400).send("Failed! Low balance");
  }

  try {
    // Insert new withdrawal record into the database
    const result = await db.query(
      "INSERT INTO withdraw (account_no, amount, bankId,userId) VALUES (?, ?, ?,?)",
      [account_no, amount, bankId,user.id]
    );

    // Send the created withdrawal as a response
    res.status(201).json({
      id: result.insertId,
      account_no,
      amount,
      status: "PENDING",
      bankId,
      created_at: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
const getDeposits = async (req, res) => {
  const userId = req.user.id;

  try {
    // SQL query to join deposits with banks based on the bank ID
    const query = req.user.isAdmin
      ? `
        SELECT 
          d.*, 
          b.method, 
          b.account 
        FROM deposit d 
        LEFT JOIN banks b ON d.bankId = b.id 
        ORDER BY d.created_at DESC
      `
      : `
        SELECT 
          d.*, 
          b.method, 
          b.account 
        FROM deposit d 
        LEFT JOIN banks b ON d.bankId = b.id 
        WHERE d.userId = ? 
        ORDER BY d.created_at DESC
      `;

    // Execute the query
    const result = req.user.isAdmin 
      ? await db.query(query) 
      : await db.query(query, [userId]);

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting user deposits");
  }
};

const getWithdraw = async (req, res) => {
  const userId = req.user.id;

  try {
    // SQL query to join withdrawals with banks based on the bank ID
    const query = req.user.isAdmin
      ? `
        SELECT 
          w.*, 
          b.method, 
          b.account 
        FROM withdraw w 
        LEFT JOIN banks b ON w.bankId = b.id 
        ORDER BY w.created_at DESC
      `
      : `
        SELECT 
          w.*, 
          b.method, 
          b.account 
        FROM withdraw w 
        LEFT JOIN banks b ON w.bankId = b.id 
        WHERE w.userId = ? 
        ORDER BY w.created_at DESC
      `;

    // Execute the query
    const result = req.user.isAdmin 
      ? await db.query(query) 
      : await db.query(query, [userId]);

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting user withdrawals");
  }
};

const handleStatusDeposit = async (req, res) => {
  const { id, accept } = req.body;

  if (!id) {
    return res.status(400).send("Fields are required");
  }

  try {
    // Query to fetch the deposit record
    const depositResult = await db.query("SELECT * FROM deposit WHERE id = ?", [
      id,
    ]);

    if (depositResult.length === 0) {
      return res.status(404).send("Deposit not found");
    }

    const deposit = depositResult[0];
    const newStatus = accept ? "ACCEPTED" : "REJECTED";

    // Update the status of the deposit
    await db.query("UPDATE deposit SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    if (accept) {
      // If the deposit is accepted, update the user's balance
      await db.query("UPDATE users SET balance = balance + ? WHERE id = ?", [
        deposit.amount,
        deposit.userId,
      ]);
    }

    res
      .status(200)
      .json({ message: `Deposit ${newStatus.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error handling deposit status");
  }
};
const handleStatusWithdraw = async (req, res) => {
  const { id, accept } = req.body;

  if (!id) {
    return res.status(400).send("Fields are required");
  }

  try {
    // Query to fetch the withdrawal record
    const withdrawResult = await db.query(
      "SELECT * FROM withdraw WHERE id = ?",
      [id]
    );

    if (withdrawResult.length === 0) {
      return res.status(404).send("Withdrawal not found");
    }

    const withdrawal = withdrawResult[0];
    const newStatus = accept ? "ACCEPTED" : "REJECTED";

    // Update the status of the withdrawal
    await db.query("UPDATE withdraw SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    if (accept) {
      // If the withdrawal is accepted, update the user's balance
      await db.query("UPDATE users SET balance = balance - ? WHERE id = ?", [
        withdrawal.amount,
        withdrawal.userId,
      ]);
    }

    res
      .status(200)
      .json({ message: `Withdrawal ${newStatus.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error handling withdrawal status");
  }
};

module.exports = {
  addBank,
  deleteBank,
  createDeposit,
  createWithdraw,
  getDeposits,
  getWithdraw,
  handleStatusDeposit,
  handleStatusWithdraw,
  getBanks
};
