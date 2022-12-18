const express = require("express");
const bodyParser = require("body-parser");

// Create an instance of the express app
const app = express();
let lastWhiteMove = {};
let currentWhiteMove = {};
let lastBlackMove = {};
let currentBlackMove = {};

app.use(express.json());

// Set up a route for the root path '/'
app.post("/move", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
