//jshint esversion:6
import { getDate } from "./date.js";
import express from "express";
import pkg from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Mongodb dabatase connect
const dbConnect = async function () {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/todoDB");
    console.log("Connected to mongodb: todoDB.");
  } catch (err) {
    console.log(err);
  }
};
dbConnect();

// Schema and model
const itemSchema = mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", itemSchema);

// urlencoded from bodyparser
const { urlencoded } = pkg;

// Replacing __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Use body-parser
app.use(urlencoded({ extended: true }));

// Send statics files like css
app.use(express.static(__dirname + "/public"));

// Set view engine to ejs
app.set("view engine", "ejs");

// Solve petition for root /
app.get("/", (req, res) => {
  res.render("list", { listTitle: getDate(), items: items });
});

// Root post with redirect
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

// Solve petition for /work
app.get("/work", (req, res) =>
  res.render("list", { listTitle: "Work List", items: workItems })
);

// Solve petition for /about
app.get("/about", (req, res) => res.render("about"));

// Get server to listen on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
