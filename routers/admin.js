const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/isAdmin");
const admin = require("../controllers/admin");
router.post("/admin/signup", admin.signup);
router.post("/admin/login", admin.login);
router.get("/admin/users", verifyToken, isAdmin, admin.getUsers);

module.exports = router;
