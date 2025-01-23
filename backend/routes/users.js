const express = require("express");
const {
  createUser,
  loginUser,
  updateUser,
  getUserSummary,
} = require("../controllers/userController");
const { basicAuth } = require("../middleware/verifyUser");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.put("/update", basicAuth, updateUser);
router.get("/dashboard", basicAuth, getUserSummary);
module.exports = router;
