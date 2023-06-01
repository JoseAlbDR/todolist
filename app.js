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

// Default items
const item1 = new Item({ name: "Welcome to your todolist!" });
const item2 = new Item({ name: "Hit the + button to add a new item." });
const item3 = new Item({ name: "<== Hit this to delete an item." });

const defaultItems = [item1, item2, item3];

// Insert items into database
const insertItems = async function (items) {
  try {
    await Item.insertMany([...items]);
    // console.log(response);
    console.log(`${[...items]} succesfully saved into todoDB.`);
  } catch (err) {
    console.log(err);
  }
};

// await insertItems(defaultItems);

// Load items from itemDB
const loadItems = async function () {
  try {
    const items = await Item.find({});
    console.log(`Items succesfully loaded.`);
    return items;
  } catch (err) {
    console.log(err);
  }
};

// If there is no items in db insert defaultItems
const insertDefaultItems = async function () {
  const items = await loadItems();
  if (items.length === 0) {
    await insertItems(defaultItems);
  }
};

const loadDefault = async function () {
  try {
    await insertDefaultItems();
    const items = await loadItems();
    return items;
  } catch (err) {
    console.log(err.message);
  }
};

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
  // Save item name into items array
  const renderItems = async function (res) {
    try {
      const items = await loadDefault();
      res.render("list", { listTitle: "Today", items: items });
    } catch (err) {
      console.log(err);
    }
  };
  renderItems(res);
});

// Root post with redirect
app.post("/", (req, res) => {
  console.log(req.body);

  const item = new Item({ name: req.body.nextItem });
  item.save();

  res.redirect("/");
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
