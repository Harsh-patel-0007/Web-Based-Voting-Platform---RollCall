const express = require("express");
const router = express.Router();

const logout = require("../controllers/userlogout");
const {protect} = require("../middleware/auth_middleware")

router.post("/logout",protect,logout.logout);

module.exports = router;