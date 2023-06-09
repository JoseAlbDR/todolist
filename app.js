//jshint esversion:6
import "dotenv/config";
import express from "express";
import pkg from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import _ from "lodash";

// Mongodb dabatase connect
const dbConnect = async function () {
  try {
    await mongoose.connect(
      `mongodb+srv://jadr:${process.env.PASS}@cluster0.en3wbp7.mongodb.net/todoDB`
    );
    console.log("Connected to mongodb: todoDB.");
  } catch (err) {
    console.log(err);
  }
};
dbConnect();

// Schema and model
const itemsSchema = mongoose.Schema({
  name: String,
});

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

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
    console.log(`Items succesfully saved into todoDB.`);
  } catch (err) {
    console.log(err);
  }
};

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

// Load default items
const loadDefault = async function () {
  try {
    await insertDefaultItems();
    const items = await loadItems();
    return items;
  } catch (err) {
    console.log(err.message);
  }
};

// Find a list add an item and redirect
const findListAdd = async function (listName, item, res) {
  try {
    const list = await List.findOne({ name: listName });
    list.items.push(item);
    list.save();
    res.redirect(`/${listName.toLowerCase().split(" ").join()}`);
  } catch (err) {
    console.log(err);
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
      const lists = await List.find({});

      const items = await loadDefault();
      res.render("list", { listTitle: "Today", items: items, lists: lists });
    } catch (err) {
      console.log(err);
    }
  };
  renderItems(res);
});

// Delete an item from default list or custom list
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.itemId;
  const listName = req.body.listTitle;
  const deleteList = req.body.listName;

  // If deleteLIst is not undefined means that delete list checkbox is clicked
  if (deleteList !== undefined) {
    List.deleteOne({ name: deleteList }).exec();

    setTimeout(() => {
      res.redirect(`/`);
    }, 1000);
  } else {
    // If is the default list
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId).exec();
      setTimeout(() => {
        res.redirect("/");
      }, 1000);
      // If it is another list
    } else {
      List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      ).exec();

      setTimeout(() => {
        res.redirect(`/${listName.toLowerCase().split(" ").join("-")}`);
      }, 1000);
    }
  }
});

// app.get("/empty", (req, res) => {
//   console.log("empty");

//   const emptyToday = async function () {
//     const lists = await List.find({});
//     console.log(lists);
//     res.render("list", { listTitle: "Today", items: [], lists: lists });
//     res.redirect("/");
//   };

//   emptyToday();
// });

// Root post with redirect
app.post("/", (req, res) => {
  console.log(req.body);

  const listName = req.body.list;
  const item = new Item({ name: req.body.nextItem });
  const newList = req.body.newList;

  // If newList is not undefined means that add list + button is clicked
  if (newList !== undefined) {
    const formatList = newList.split(" ").join("-");
    console.log(formatList);

    res.redirect(`/${formatList.toLowerCase()}`);
  } else {
    // If list is default one
    if (listName === "Today") {
      item.save();
      res.redirect("/");

      // If list is a custom one
    } else {
      findListAdd(listName, item, res);
    }
  }
});

// Solve petition for custom named list
app.get("/:listName", (req, res) => {
  // List name from express routing
  const listName = _.startCase(req.params.listName);

  // Try to load the list if exist, if not create a new one
  const loadList = async function (listName) {
    try {
      const lists = await List.find({});
      const foundList = await List.findOne({ name: listName });
      if (foundList === null) {
        const newList = new List({ name: listName, items: defaultItems });
        newList.save();
        res.redirect(`/${newList.name.toLowerCase().split(" ").join("-")}`);
        console.log("List already exist.");
      } else {
        console.log("List found.");
        res.render("list", {
          listTitle: foundList.name,
          items: foundList.items,
          lists: lists,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  loadList(listName);
});

// Solve petition for /about
app.get("/about", (req, res) => res.render("about"));

// Get server to listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000.");
});
