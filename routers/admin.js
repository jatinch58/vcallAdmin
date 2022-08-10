const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/isAdmin");
const admin = require("../controllers/admin");
router.post("/admin/signup", admin.signup);
router.post("/admin/login", admin.login);
router.get("/admin/users", verifyToken, isAdmin, admin.getUsers);
//================================= host requests ======================================================//
router.get("/admin/hostsRequest", verifyToken, isAdmin, admin.getHostRequests);
router.get(
  "/admin/pendingHostRequest",
  verifyToken,
  isAdmin,
  admin.getPendingHostRequests
);
router.get(
  "/admin/acceptedHostRequest",
  verifyToken,
  isAdmin,
  admin.getAcceptedHostRequests
);
router.get(
  "/admin/rejectedHostRequest",
  verifyToken,
  isAdmin,
  admin.getRejectedHostRequests
);

router.put(
  "/admin/acceptHostRequest",
  verifyToken,
  isAdmin,
  admin.acceptHostRequest
);
router.put(
  "/admin/rejectHostRequest",
  verifyToken,
  isAdmin,
  admin.rejectHostRequest
);
module.exports = router;
