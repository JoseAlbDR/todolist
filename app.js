//jshint esversion:6
const date = require("./date.js");
const express = require("express");
const bodyParser = require("body-parser");
const items = [];
const workItems = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("list", { listTitle: date.day, items: items });
});

app.post("/", (req, res) => {
  console.log(req.body);
  if (req.body.list === "Work") {
    workItems.push(req.body.nextItem);
    res.redirect("/work");
  } else {
    items.push(req.body.nextItem);
    res.redirect("/");
  }
});

app.get("/work", (req, res) =>
  res.render("list", { listTitle: "Work List", items: workItems })
);

app.get("/about", (req, res) => res.render("about"));

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
