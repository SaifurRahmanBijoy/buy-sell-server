const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6ceglb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// apis in try finally
async function run() {
  try {
    const categorizedProductsCollection = client
      .db("wishBoat")
      .collection("categorisedProducts");
    const usersCollection = client
      .db("wishBoat")
      .collection("users");

    app.get("/categories", async (req, res) => {
      const query = {};
      const results = await categorizedProductsCollection.find(query).toArray();
      res.send(results);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const results = await categorizedProductsCollection.findOne(query);
      console.log(results);
      res.send(results);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("WISH BOAT IS RUNNING...");
});

app.listen(port, () => {
  console.log("WISH BOAT IS RUNNING ON PORT:", port);
});
