const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const admindb = require("../models/admin");
const userdb = require("../models/userProfile");
const hostdb = require("../models/hostForm");
//============================================ sign up ================================================//
exports.signup = async (req, res) => {
  try {
    const admin = await admindb.findOne({ username: req.body.username });
    if (admin) {
      return res.status(409).send({ message: "This username already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    const adminSchema = new admindb({
      username: req.body.username,
      password: hashpassword,
    });
    adminSchema
      .save()
      .then((result) => {
        return res
          .status(200)
          .send({ message: "Saved successfully", data: result });
      })
      .catch((e) => {
        return res.status(500).send({ message: e.name });
      });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//============================================== login ================================================//
exports.login = async (req, res) => {
  try {
    const { body } = req;
    const adminSchema = Joi.object()
      .keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required();
    let result = adminSchema.validate(body);
    if (result.error) {
      return res.status(400).send({ message: result.error.details[0].message });
    }
    const admin = await admindb.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(401).send({ message: "Invalid username" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_PASSWORD, {
      expiresIn: "24h",
    });
    return res.status(200).send({ token: token });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//======================================= get all registered users ========================================//
exports.getUsers = async (req, res) => {
  try {
    const users = await userdb.find();
    return res.status(200).send({ result: users });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//======================================== get host requests ==============================================//
exports.getHostRequests = async (req, res) => {
  try {
    const hosts = await hostdb.find({});
    return res.status(200).send({ result: hosts });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//================================== get pending host requests ==============================================//
exports.getPendingHostRequests = async (req, res) => {
  try {
    const hosts = await hostdb.find({ requestStatus: "pending" });
    return res.status(200).send({ result: hosts });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//================================== get accepted host requests ==============================================//
exports.getAcceptedHostRequests = async (req, res) => {
  try {
    const hosts = await hostdb.find({ requestStatus: "accepted" });
    return res.status(200).send({ result: hosts });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//================================== get rejected host requests ==============================================//
exports.getRejectedHostRequests = async (req, res) => {
  try {
    const hosts = await hostdb.find({ requestStatus: "rejected" });
    return res.status(200).send({ result: hosts });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};
//======================================= accept host requests ============================================//
exports.acceptHostRequest = async (req, res) => {
  try {
    const { body } = req;
    const hasRequestId = Joi.object()
      .keys({
        requestId: Joi.string().required(),
      })
      .required();
    const validator = hasRequestId.validate(body);
    if (validator.error) {
      return res
        .status(400)
        .send({ message: validator.error.details[0].message });
    }
    const result = await hostdb.findByIdAndUpdate(req.body.requestId, {
      requestStatus: "accepted",
    });
    if (!result) {
      return res.status(500).send({ message: "Something bad happened" });
    }
    return res.status(200).send({ message: "Accepted Successfully" });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
//======================================= reject host requests ============================================//
exports.rejectHostRequest = async (req, res) => {
  try {
    const { body } = req;
    const hasRequestId = Joi.object()
      .keys({
        requestId: Joi.string().required(),
      })
      .required();
    const validator = hasRequestId.validate(body);
    if (validator.error) {
      return res
        .status(400)
        .send({ message: validator.error.details[0].message });
    }
    const result = await hostdb.findByIdAndUpdate(req.body.requestId, {
      requestStatus: "rejected",
    });
    if (!result) {
      return res.status(500).send({ message: "Something bad happened" });
    }
    return res.status(200).send({ message: "Rejected Successfully" });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
