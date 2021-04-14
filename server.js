const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT;
const url = process.env.URL;

const app = express();
const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

let db, col;

//GET API INFO AND ROUTES
app.get("/", (req, res) => {
  console.log("Request: GET/");
  let data = {
    TITLE: "THE CAT DATABASE",
    "GET/api": "get all cat breeds",
    "GET/api/:id": "get cat breed by ID",
    "POST/api": "insert cat breed",
    "PUT/api": "update cat breed",
    "DELETE/api/:id": "delete cat breed by ID",
  };
  res.send(data);
});
//GET ALL CAT BREEDS
app.get("/api", (req, res) => {
  console.log("Request: GET/api");
  const getCats = async () => {
    let cats = await col.find().toArray();
    res.send(cats);
  };
  getCats();
});
//GET ONE CAT BREED BY ID
app.get("/api/:id", (req, res) => {
  console.log("Request: GET/api/:id");
  const getCats = async () => {
    let cat = await col.findOne({ _id: new ObjectId(req.params.id) });
    if (cat === null) {
      res.send({ error: "cat breed doesn't exist" });
    } else {
      res.send(cat);
    }
  };
  getCats();
});
app.get("/about", (req, res) => {
  res.send({});
});
//INSERT CAT BREED
app.post("/api", (req, res) => {
  console.log("Request: POST/api");
  const postCat = async () => {
    if (req.body.breed === null) {
      res.send({ error: "you need to provide cat breed" });
    } else {
      const exists = await col.findOne({ breed: sanitize(req.body.breed) });
      if (exists != null) {
        res.send({ error: "cat breed already exists", exists });
      } else {
        let cat = new Cat(
          (breed = sanitize(req.body.breed)),
          (locationOfOrigin = sanitize(req.body.locationOfOrigin)),
          (type = sanitize(req.body.type)),
          (bodyType = sanitize(req.body.bodyType)),
          (coatLength = sanitize(req.body.coatLength)),
          (coatPattern = sanitize(req.body.coatPattern)),
          (image = req.body.image)
        );
        await col.insertOne(cat);
        res.send({ message: "cat breed insert successful" });
      }
    }
  };
  postCat();
});
//UPDATE ONE CAT BREED
app.put("/api", (req, res) => {
  console.log("Request: POST/api");
  const updateCat = async () => {
    let toUpdate = {
      _id: new ObjectId(req.body._id),
    };
    let cat = new Cat(
      (breed = sanitize(req.body.breed)),
      (locationOfOrigin = sanitize(req.body.locationOfOrigin)),
      (type = sanitize(req.body.type)),
      (bodyType = sanitize(req.body.bodyType)),
      (coatLength = sanitize(req.body.coatLength)),
      (coatPattern = sanitize(req.body.coatPattern)),
      (image = req.body.image)
    );
    await col.updateOne(toUpdate, { $set: cat });
    res.send({ message: "cat breed update successful" });
  };
  updateCat();
});
//DELETE CAT BREED
app.delete("/api/:id", (req, res) => {
  console.log("Request: DELETE/api/:id");
  const deleteCat = async () => {
    let cat = await col.findOne({ _id: new ObjectId(req.params.id) });
    if (cat === null) {
      res.send({ error: "cat breed doesn't exist" });
    } else {
      await col.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send({ message: "cat breed delete successful" });
    }
  };
  deleteCat();
});

//START THE APPLICATION
const run = async () => {
  try {
    await client.connect();
    console.log("Database Connection Successful!");
    db = client.db("the_cat_database");
    col = db.collection("cats");
    app.listen(port);
  } catch (err) {
    console.log(err.stack);
  }
};
run().catch(console.dir);

const sanitize = (string) => {
  return string.toLowerCase().replace(" ", "_");
};

class Cat {
  constructor(
    breed,
    locationOfOrigin = null,
    type = null,
    bodyType = null,
    coatLength = null,
    coatPattern = null,
    image = null
  ) {
    this.breed = breed;
    this.locationOfOrigin = locationOfOrigin;
    this.type = type;
    this.bodyType = bodyType;
    this.coatLength = coatLength;
    this.coatPattern = coatPattern;
    this.image = image;
  }
}
