const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { db } = require("./db");
const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  // res.sendFile(path.join(__dirname, "build", "index.html"));
  res.send("Welcome");
});

// app.listen takes 2 arguments
db.sync().then(() => {
  console.log("db synced");
  app.listen(PORT, () =>
    console.log(`studiously serving silly sounds on port ${PORT}`)
  );
});
