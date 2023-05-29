//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const items = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const today = new Date();
  const day = today.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  res.render("list", { day: day, items: items });
});

app.post("/", (req, res) => {
  items.push(req.body.nextItem);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
