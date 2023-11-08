const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://techBlog:3MjWHr9fpxYQg5Ao@cluster0.lz5tib6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const blogPostCollection = client.db("techBlog").collection("addBlogPost");
    const blogCommentCollection = client.db("techBlog").collection("blogComment");
    const wishListCommentCollection = client.db("techBlog").collection("wishList");

    app.post("/api/v1/create-post", async (req, res) => {
        const post = req.body;
        const result = await blogPostCollection.insertOne(post);
        res.send(result);
      });

      app.get("/api/v1/all-post",  async (req, res) => {
        const cursor = blogPostCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get("/api/v1/all-post/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await blogPostCollection.findOne(query);
        res.send(result);
      });
      // comment section 
      app.post("/api/v1/create-comment", async (req, res) => {
        const post = req.body;
        const result = await blogCommentCollection.insertOne(post);
        console.log(result);
        res.send(result);
      });

      app.get("/api/v1/all-comment",  async (req, res) => {
        const cursor = blogCommentCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      // wish List section 
      app.post("/api/v1/crate-wishList", async (req, res) => {
        const post = req.body;
        const result = await wishListCommentCollection.insertOne(post);
        console.log(result);
        res.send(result);
      });

      app.get("/api/v1/all-wishList",  async (req, res) => {
        const cursor = wishListCommentCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      // delete from wishlist 
      app.delete("/api/v1/all-wishList/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await wishListCommentCollection.deleteOne(query);
        res.send(result)
      });

      // update post 
      app.put("/api/v1/all-post/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true }; 
        const updatedData = {
          $set: {
            title: data.title,
            imgUrl: data.imgUrl,
            category: data.category,
            shortDes: data.shortDes,
            longDes: data.longDes,
            
          },
        };
        const result = await blogPostCollection.updateOne(filter, updatedData, options);
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Blog is available now')
})

app.listen(port, () =>{
    console.log(`Blog server is running on port: ${port}`);
})