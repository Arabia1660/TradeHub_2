const express = require("express");
const { basicAuth } = require("../middleware/verifyUser");
const { buyStock, sellStock, searchStocks, addSymbol, deleteSymbol, getAllSymbols, adminDashboardInfo, getInvestment, getTransactions, buyCurrency, sellCurrency, addCurrencySymbol, deleteCurrencySymbol, getAllCurrencySymbols, search } = require("../controllers/tradeController");
const router = express.Router();

router.post("/buy",basicAuth,buyStock)
router.post("/sell",basicAuth,sellStock)
router.post("/buy-currency",basicAuth,buyCurrency)
router.post("/sell-currency",basicAuth,sellCurrency)
router.get("/search",searchStocks)
router.get("/search-stock",search)
router.post("/add-symbol",basicAuth,addSymbol)
router.delete("/delete-symbol",basicAuth,deleteSymbol)
router.get("/get-symbol",basicAuth,getAllSymbols)
router.get("/dashboard",basicAuth,adminDashboardInfo)
router.get("/investment",basicAuth,getInvestment)
router.get("/transaction",basicAuth,getTransactions)
router.post("/add-currency-symbol",basicAuth,addCurrencySymbol)
router.delete("/delete-currency-symbol",basicAuth,deleteCurrencySymbol)
router.get("/get-currency-symbol",basicAuth,getAllCurrencySymbols)
module.exports=router