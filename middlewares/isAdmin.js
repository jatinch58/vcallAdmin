const admindb = require("../models/admin");
exports.isAdmin = async (req, res, next) => {
  const admin = await admindb.findById(req.user._id);
  if (admin) {
    return next();
  }
  return res.status(403).send({ message: "You're not admin" });
};
