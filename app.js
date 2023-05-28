//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const today = new Date();
  let day = "";
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  day = weekDays[today.getDay()];

  res.render("list", { day: day });

  //   today.getDay() === 6 || today.getDay() === 0
  //     ? (day = "Weekend")
  //     : (day = "Week Day");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
