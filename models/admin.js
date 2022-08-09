const { model, Schema } = require("mongoose");
const adminSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = model("admin", adminSchema);
