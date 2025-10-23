require("dotenv").config();
const express = require("express");
const pool = require("./config/db");  // <— add this line
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("ReviewHub backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
