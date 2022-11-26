const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
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

// verify jwt
function verifyJWT(req, res, next) {
  console.log("token inside verifyJWT:", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send("Unauthorized Access!");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

// apis in try finally
async function run() {
  try {
    const categorizedProductsCollection = client
      .db("wishBoat")
      .collection("categorisedProducts");
    const usersCollection = client.db("wishBoat").collection("users");

    app.get("/categories", async (req, res) => {
      const query = {};
      const results = await categorizedProductsCollection.find(query).toArray();
      res.send(results);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const results = await categorizedProductsCollection.findOne(query);
      res.send(results);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users/:type", async (req, res) => {
      const type = req.params.type;
      const specifiedUsers = { role: type };
      const result = await usersCollection.find(specifiedUsers).toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const specifiedUsers = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(specifiedUsers);
      res.send(result);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      // console.log(user);
      res.send({ isAdmin: user?.role === "admin" });
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "1d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });
    // --> //
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
