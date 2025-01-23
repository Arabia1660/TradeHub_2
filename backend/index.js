// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const userRoutes = require("./routes/users");
const bankRoutes = require("./routes/bank");
const socialRoutes = require("./routes/social");
const tradeRoutes = require("./routes/trade");
const { Server } = require("socket.io");
const http = require("http");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;
const db = require("./db/connection");

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies, headers, etc.
  },
});
app.use(express.json());

//make public folder
app.use("/uploads", express.static("uploads"));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Initialize Multer with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
    }
  },
});

// Test Route
app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use("/api/users", userRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/trade", tradeRoutes);

// Endpoint to upload multiple images
app.post("/api/upload", upload.array("pictures", 5), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded");
    }

    const filePaths = files.map((file) => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    }));

    res.json({
      message: "Files uploaded successfully",
      files: filePaths,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
});
////socket
//socket
//socket

// Array of stock symbols to track
const stockSymbols = ["AAPL", "GOOGL", "MSFT"];
const port = process.env.PORT || 5000;

// Store price history to send to clients
const priceHistory = {};

// Function to fetch live stock prices every 30 seconds
const fetchLivePrices = async () => {
  //console.log('Fetching live stock prices...');
  const res = await db.query(
    "SELECT stock_symbol FROM stock_symbols ORDER BY id ASC"
  );
  const data = res?.map((d) => d.stock_symbol);

  for (const symbol of data) {
    try {
      const result = await yahooFinance.quote(symbol);
      const price = result.regularMarketPrice;
      const priceData = {
        symbol,
        price,
        time: new Date().toISOString(),
      };

      //console.log(`[${symbol}] Price: $${price} at ${priceData.time}`);

      // Add data to price history (keep only last 50 data points)
      if (!priceHistory[symbol]) priceHistory[symbol] = [];
      priceHistory[symbol].push(priceData);
      if (priceHistory[symbol].length > 50) priceHistory[symbol].shift();

      // Emit the updated price to all connected clients
      io.emit("stockPriceUpdate", { symbol, price, time: priceData.time });
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
    }
  }
};
const fetchLiveMarket = async () => {
  try {
    console.log("Fetching live forex prices...");

    // Fetch exchange rates from a forex API
    const res = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
    const rates = res.data.rates;

    // Filter only major currency pairs if needed
    const response = await db.query(
      "SELECT stock_symbol FROM currency_symbols ORDER BY id ASC"
    );
    const selectedCurrencies = response?.map((d) => d.stock_symbol);
    const livePrices = Object.entries(rates).filter(([symbol]) =>
      selectedCurrencies.includes(symbol)
    );

    // Simulate price data and emit updates
    for (const [symbol, price] of livePrices) {
      const priceData = {
        symbol: symbol,
        price:1/price,
        time: new Date().toISOString(),
      };

      //console.log(`[USD/${symbol}] Price: ${price} at ${priceData.time}`);

      // Maintain price history (last 50 data points)
      if (!priceHistory[symbol]) priceHistory[symbol] = [];
      priceHistory[symbol].push(priceData);
      if (priceHistory[symbol].length > 50) priceHistory[symbol].shift();

      // Emit updated prices to connected clients
      io.emit("currencyPriceUpdate", priceData);
    }
  } catch (error) {
    console.error("Error fetching live forex prices:", error.message);
  }
};

// Run the fetchLivePrices function every 30 seconds
setInterval(fetchLivePrices, 4000);
setInterval(fetchLiveMarket, 4000);
fetchLiveMarket()
// Send the initial price history to new clients
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send the price history to the client
  socket.emit("initialPriceHistory", priceHistory);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
