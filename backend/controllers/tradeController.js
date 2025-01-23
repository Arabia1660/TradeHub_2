const axios = require("axios");
const db = require("../db/connection");
const yahooFinance = require("yahoo-finance2").default;

// Buy stock endpoint
const buyStock = async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user.id;
  try {
    // 1. Get stock price from Alpha Vantage
    const result = await yahooFinance.quote(symbol);
    const stockPrice = result.regularMarketPrice;

    if (!stockPrice) {
      return res
        .status(400)
        .json({ message: "Could not fetch stock price. Try again later." });
    }

    // 2. Calculate the total cost
    const totalCost = stockPrice * quantity;

    // 3. Check user's balance
    const userQuery = `SELECT balance FROM users WHERE id = ?`;
    const [user] = await db.query(userQuery, [userId]);

    if (!user || user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 4. Deduct the balance
    const newBalance = user.balance - totalCost;
    const updateBalanceQuery = `UPDATE users SET balance = ? WHERE id = ?`;
    await db.query(updateBalanceQuery, [newBalance, userId]);

    // 5. Insert into Investments table
    const investmentQuery = `INSERT INTO investments (user_id, stock_symbol, quantity, buy_price) VALUES (?, ?, ?, ?)`;
    await db.query(investmentQuery, [userId, symbol, quantity, stockPrice]);

    // 6. Log the transaction
    const transactionQuery = `INSERT INTO transactions (user_id, stock_symbol, quantity, price, transaction_type) VALUES (?, ?, ?, ?, 'buy')`;
    await db.query(transactionQuery, [userId, symbol, quantity, stockPrice]);

    res.status(201).json({ message: "Stock purchased successfully!" });
  } catch (error) {
    console.error("Error purchasing stock:", error);
    res
      .status(500)
      .json({ message: "An error occurred while purchasing stock" });
  }
};
const buyCurrency = async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user.id;
  try {
    // 1. Get stock price from Alpha Vantage
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const rates = response.data.rates[symbol]
    const totalCost = (1/rates) * quantity;
    const stockPrice=(1/rates)

    if (!totalCost) {
      return res
        .status(400)
        .json({ message: "Could not fetch stock price. Try again later." });
    }


    // 3. Check user's balance
    const userQuery = `SELECT balance FROM users WHERE id = ?`;
    const [user] = await db.query(userQuery, [userId]);

    if (!user || user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 4. Deduct the balance
    const newBalance = user.balance - totalCost;
    const updateBalanceQuery = `UPDATE users SET balance = ? WHERE id = ?`;
    await db.query(updateBalanceQuery, [newBalance, userId]);

    // 5. Insert into Investments table
    const investmentQuery = `INSERT INTO investments (user_id, stock_symbol, quantity, buy_price) VALUES (?, ?, ?, ?)`;
    await db.query(investmentQuery, [userId, symbol, quantity, stockPrice]);

    // 6. Log the transaction
    const transactionQuery = `INSERT INTO transactions (user_id, stock_symbol, quantity, price, transaction_type) VALUES (?, ?, ?, ?, 'buy')`;
    await db.query(transactionQuery, [userId, symbol, quantity, stockPrice]);

    res.status(201).json({ message: "Stock purchased successfully!" });
  } catch (error) {
    console.error("Error purchasing stock:", error);
    res
      .status(500)
      .json({ message: "An error occurred while purchasing stock" });
  }
};
const sellStock = async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user.id;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity to sell" });
  }

  try {
    // 1. Get stock price from Yahoo Finance (ensure you handle the case where price is missing)
    const result = await yahooFinance.quote(symbol);
    const stockPrice = result?.regularMarketPrice;

    if (!stockPrice) {
      return res
        .status(400)
        .json({ message: "Could not fetch stock price. Try again later." });
    }

    // 2. Check how many stocks the user owns (total buys - total sells)
    const countStockQuery = `SELECT COALESCE(SUM(quantity), 0) AS total FROM transactions WHERE user_id = ? AND stock_symbol = ? AND transaction_type = 'buy'`;
    const [countStock] = await db.query(countStockQuery, [userId, symbol]);

    const countSellQuery = `SELECT COALESCE(SUM(quantity), 0) AS total FROM transactions WHERE user_id = ? AND stock_symbol = ? AND transaction_type = 'sell'`;
    const [countSell] = await db.query(countSellQuery, [userId, symbol]);

    const myStock = countStock.total - countSell.total;
    console.log("My Available Stock:", myStock);
    console.log("Total Bought:", countStock.total);
    console.log("Total Sold:", countSell.total);

    if (myStock < quantity) {
      return res.status(400).json({ message: "Not enough shares to sell" });
    }

    // 3. Calculate the total value of the sale
    const totalValue = stockPrice * quantity;

    // 4. Update the user's balance
    const updateBalanceQuery = `UPDATE users SET balance = balance + ? WHERE id = ?`;
    await db.query(updateBalanceQuery, [totalValue, userId]);

    // 5. Update the user's investment
    const updateInvestmentQuery = `UPDATE investments SET quantity = quantity - ? WHERE user_id = ? AND stock_symbol = ?`;
    await db.query(updateInvestmentQuery, [quantity, userId, symbol]);

    // If quantity becomes 0, delete the investment entry
    const deleteInvestmentQuery = `DELETE FROM investments WHERE user_id = ? AND stock_symbol = ? AND quantity = 0`;
    await db.query(deleteInvestmentQuery, [userId, symbol]);

    // 6. Log the transaction
    const transactionQuery = `INSERT INTO transactions (user_id, stock_symbol, quantity, price, transaction_type) VALUES (?, ?, ?, ?, 'sell')`;
    await db.query(transactionQuery, [userId, symbol, quantity, stockPrice]);

    res.status(201).json({ message: "Stock sold successfully!" });
  } catch (error) {
    console.error("Error selling stock:", error);
    res.status(500).json({ message: "An error occurred while selling stock" });
  }
};
const sellCurrency= async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user.id;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity to sell" });
  }

  try {
    // 1. Get stock price from Yahoo Finance (ensure you handle the case where price is missing)
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const rates = response.data.rates[symbol]
    const stockPrice=(1/rates)

    if (!stockPrice) {
      return res
        .status(400)
        .json({ message: "Could not fetch stock price. Try again later." });
    }

    // 2. Check how many stocks the user owns (total buys - total sells)
    const countStockQuery = `SELECT COALESCE(SUM(quantity), 0) AS total FROM transactions WHERE user_id = ? AND stock_symbol = ? AND transaction_type = 'buy'`;
    const [countStock] = await db.query(countStockQuery, [userId, symbol]);

    const countSellQuery = `SELECT COALESCE(SUM(quantity), 0) AS total FROM transactions WHERE user_id = ? AND stock_symbol = ? AND transaction_type = 'sell'`;
    const [countSell] = await db.query(countSellQuery, [userId, symbol]);

    const myStock = countStock.total - countSell.total;
    console.log("My Available Stock:", myStock);
    console.log("Total Bought:", countStock.total);
    console.log("Total Sold:", countSell.total);

    if (myStock < quantity) {
      return res.status(400).json({ message: "Not enough shares to sell" });
    }

    // 3. Calculate the total value of the sale
    const totalValue = stockPrice * quantity;

    // 4. Update the user's balance
    const updateBalanceQuery = `UPDATE users SET balance = balance + ? WHERE id = ?`;
    await db.query(updateBalanceQuery, [totalValue, userId]);

    // 5. Update the user's investment
    const updateInvestmentQuery = `UPDATE investments SET quantity = quantity - ? WHERE user_id = ? AND stock_symbol = ?`;
    await db.query(updateInvestmentQuery, [quantity, userId, symbol]);

    // If quantity becomes 0, delete the investment entry
    const deleteInvestmentQuery = `DELETE FROM investments WHERE user_id = ? AND stock_symbol = ? AND quantity = 0`;
    await db.query(deleteInvestmentQuery, [userId, symbol]);

    // 6. Log the transaction
    const transactionQuery = `INSERT INTO transactions (user_id, stock_symbol, quantity, price, transaction_type) VALUES (?, ?, ?, ?, 'sell')`;
    await db.query(transactionQuery, [userId, symbol, quantity, stockPrice]);

    res.status(201).json({ message: "Stock sold successfully!" });
  } catch (error) {
    console.error("Error selling stock:", error);
    res.status(500).json({ message: "An error occurred while selling stock" });
  }
};

const searchStocks = async (req, res) => {
  const { search } = req.query;
  try {
    const searchResult = await yahooFinance.search(search);

    // Filter out null, undefined, or "null" strings and structure the result as [{ id: 1, symbol: "AAPL" }]
    const stockSymbols = searchResult.quotes
      .map((quote) => quote.symbol)
      .filter((symbol) => symbol && symbol !== "null") // Remove null, undefined, and "null" as string
      .map((symbol, index) => ({ id: index + 1, symbol })); // Add ID to each symbol

    res.json(stockSymbols);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const search = async (req, res) => {
  const { search } = req.query;
  try {
    const searchResult = await yahooFinance.search(search);

    // Filter out null, undefined, or "null" strings and structure the result as [{ id: 1, symbol: "AAPL" }]
    const stockSymbols = searchResult.quotes
      .filter((quote) => quote.symbol && quote.symbol !== "null") // Remove null, undefined, and "null" as string

    res.json(stockSymbols);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const addSymbol = async (req, res) => {
  const { stock_symbol } = req.body;

  if (!stock_symbol) {
    return res.status(400).send("Stock symbol is required");
  }

  try {
    // Insert new stock symbol record into the database
    const result = await db.query(
      "INSERT INTO stock_symbols (stock_symbol) VALUES (?)",
      [stock_symbol]
    );

    // Send the created stock symbol as a response
    res.status(201).json({
      id: result.insertId,
      stock_symbol,
      created_at: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding stock symbol");
  }
};
const deleteSymbol = async (req, res) => {
  const { id } = req.query;
  //console.log(id)

  if (!id) {
    return res.status(400).send("Symbol ID is required");
  }

  try {
    const result = await db.query("DELETE FROM stock_symbols WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Symbol not found");
    }

    res.status(200).json({ message: "Symbol deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting symbol");
  }
};
const getAllSymbols = async (req, res) => {
  const { currency } = req.query;
  try {
    const result = currency
      ? await db.query("SELECT * FROM currency_symbols ORDER BY id ASC")
      : await db.query("SELECT * FROM stock_symbols ORDER BY id ASC");

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting stock symbols");
  }
};
const adminDashboardInfo = async (req, res) => {
  try {
    const shareRes = await db.query("SELECT * FROM stock_symbols");
    const banksRes = await db.query("SELECT * FROM banks");
    const deposit = await db.query("SELECT * FROM deposit WHERE status=?", [
      "ACCEPTED",
    ]);
    const withdraw = await db.query("SELECT * FROM withdraw WHERE status=?", [
      "ACCEPTED",
    ]);
    const totalDeposit = deposit?.reduce((sum, d) => sum + d.amount, 0);
    const totalWithdraw = withdraw?.reduce((sum, d) => sum + d.amount, 0);
    res.json({
      share: shareRes?.length,
      banks: banksRes?.length,
      deposit: totalDeposit,
      withdraw: totalWithdraw,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getInvestment = async (req, res) => {
  const user = req.user;
  try {
    const result = await db.query(
      "SELECT * FROM investments WHERE user_id=? ORDER BY created_at DESC",
      [user.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getTransactions = async (req, res) => {
  const user = req.user;
  try {
    const result = await db.query(
      "SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC",
      [user.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const addCurrencySymbol = async (req, res) => {
  const { stock_symbol } = req.body;

  if (!stock_symbol) {
    return res.status(400).send("Stock symbol is required");
  }

  try {
    // Insert new stock symbol record into the database
    const result = await db.query(
      "INSERT INTO currency_symbols (stock_symbol) VALUES (?)",
      [stock_symbol]
    );

    // Send the created stock symbol as a response
    res.status(201).json({
      id: result.insertId,
      stock_symbol,
      created_at: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding stock symbol");
  }
};
const deleteCurrencySymbol = async (req, res) => {
  const { id } = req.query;
  //console.log(id)

  if (!id) {
    return res.status(400).send("Symbol ID is required");
  }

  try {
    const result = await db.query("DELETE FROM currency_symbols WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Symbol not found");
    }

    res.status(200).json({ message: "Symbol deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting symbol");
  }
};
const getAllCurrencySymbols = async (req, res) => {
  const { currency } = req.query;
  try {
    const result = currency
      ? await db.query("SELECT * FROM currency_symbols ORDER BY id ASC")
      : await db.query("SELECT * FROM currency_symbols ORDER BY id ASC");

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting stock symbols");
  }
};

module.exports = {
  buyStock,
  sellStock,
  searchStocks,
  addSymbol,
  deleteSymbol,
  getAllSymbols,
  adminDashboardInfo,
  getInvestment,
  buyCurrency,
  getTransactions,
  sellCurrency,
  addCurrencySymbol,
  deleteCurrencySymbol,
  getAllCurrencySymbols,
  search
};
