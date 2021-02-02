const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { db } = require("./db");
const app = express();
const PORT = process.env.PORT;
const volleyball = require("volleyball");

// logging middleware
// Only use logging middleware when not running tests
const debug = process.env.NODE_ENV === "test";
app.use(volleyball.custom({ debug }));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

app.use("/api", require("./api"));

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
