const express = require("express");
const { basicAuth } = require("../middleware/verifyUser");
const { addBank, deleteBank, createDeposit, createWithdraw, getDeposits, getWithdraw, handleStatusDeposit, handleStatusWithdraw, getBanks } = require("../controllers/bankController");
const router = express.Router();

router.post("/add-bank",basicAuth,addBank)
router.get("/get-bank",basicAuth,getBanks)
router.delete("/delete-bank",basicAuth,deleteBank)
router.post("/deposit",basicAuth,createDeposit)
router.post("/withdraw",basicAuth,createWithdraw)
router.get("/deposit",basicAuth,getDeposits)
router.get("/withdraw",basicAuth,getWithdraw)
router.put("/status-deposit",basicAuth,handleStatusDeposit)
router.put("/status-withdraw",basicAuth,handleStatusWithdraw)
module.exports = router;