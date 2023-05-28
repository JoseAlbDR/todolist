//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const today = new Date();
  console.log(today.getTime());

  if (today.getDay() === 6 || today.getDay() === 0) {
    res.send("Yay it is the weekend!.");
  } else {
    res.send("Fucking week.");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
