require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routers = require("./routers/index");
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(routers);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((e) => {
    console.log(e);
  });
app.listen(PORT, () => {
  console.log("Server is listening to port " + PORT);
});
