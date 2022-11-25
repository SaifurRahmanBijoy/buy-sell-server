const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("WISH BOAT IS RUNNING...");
});

app.listen(port, () => {
  console.log("WISH BOAT IS RUNNING ON PORT:", port);
});
