const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

const productDB = "BrandShop"; // Database name

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhtgohj.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    // console.log("Connected to MongoDB!");
    const productCollection = client.db(productDB).collection("product");
    const cartCollection = client.db(productDB).collection("cart");

    // Routes for product collection
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get('/products/:id', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Received ID:', id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          rating: updateProduct.rating,
          des: updateProduct.des,
          image: updateProduct.image
        }
      };
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    });

   

    // Routes for cart collection
    app.get('/mycart/:email', async (req, res) => {
      const email = req.params.email;
      const cursor = cartCollection.find({email:email});
      const result = await cursor.toArray();
      res.send(result);
    });
   
    app.post('/mycart/:email', async (req, res) => {
      // const email = req.params.email;
      // console.log('Received Email:', email);
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });

    app.delete('/mycart/:_id', async (req, res) => {
      const _id = req.params._id;
      console.log('Received delete request for ID:', _id); // Add this line for debugging
      const query = { _id: _id };
      const result = await cartCollection.deleteOne(query);
      console.log('Delete result:', result);
      res.send(result);
    });
    


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally{
    
  }
}

run()


  app.get('/', (req, res) => {
    res.send("Product like movie");
  });

  app.listen(port, () => {
    console.log(`Product server listening on port ${port}`);
  });
 
