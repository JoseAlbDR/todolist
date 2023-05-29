//jshint esversion:6
import { getDate } from "./date.js";
import express from "express";
import pkg from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// urlencoded from bodyparser
const { urlencoded } = pkg;
const items = [];
const workItems = [];

// Replacing __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("list", { listTitle: getDate(), items: items });
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
