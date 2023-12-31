const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3jlezqe.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const categoryCollection = client.db("truck").collection("kidsTruck");

    app.get("/kidsTruck", async (req, res) => {
      const cursor = categoryCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/kidsTruck", async (req, res) => {
      const data = req.body;
      console.log(data);
      
      const result = await categoryCollection.insertOne(data);
      res.send(result);
    });

    app.get("/kidsTruck/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    app.delete('/kidsTruck/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
  })

  app.patch('/kidsTruck/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedToy = req.body;
    const updateDoc = {
        $set: {
            status: updatedToy.status
        },
    };
    const result = await categoryCollection.updateOne(filter, updateDoc);
    res.send(result);
})



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch(err){
    console.log(err)
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("kids is running");
});

app.listen(port, () => {
  console.log(`Car kids Server is running on port ${port}`);
});
