const express = require("express");
const router = express.Router();
const adminRouter = require("./admin");
router.use(adminRouter);
module.exports = router;
