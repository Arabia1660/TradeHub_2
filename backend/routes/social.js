const express = require("express");
const { basicAuth } = require("../middleware/verifyUser");
const { addNews, getNews } = require("../controllers/socialController");
const router = express.Router();

router.post("/add",basicAuth,addNews)
router.get("/get",basicAuth,getNews)

module.exports=router