const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfkzfdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const coffeesCollections = client.db('CoffeesDB').collection('Coffee')
    const usersCollections = client.db('CoffeesDB').collection('Users')

    app.get('/coffees', async(req,res)=>{
        const coffeesData = req.body;
        const result = await coffeesCollections.find(coffeesData).toArray()
        res.send(result)
    })

    app.get('/coffees/:id', async(req, res)=>{
        const id= req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollections.findOne(query)
        res.send(result)
    })

    app.post('/coffees', async(req, res)=>{
        const newCoffee = req.body
       const result = await coffeesCollections.insertOne(newCoffee)
       res.send(result)
    })

    app.put('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const coffeesData = req.body;
        const filter = {_id: new ObjectId(id)}
        const updatedDocs = {
            $set: coffeesData
        }
        const options = { upsert: true };
        const result = await coffeesCollections.updateOne(filter, updatedDocs, options)
        res.send(result)
    })
    app.delete('/coffees/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollections.deleteOne(query)
        console.log(result)
        res.send(result)
    })
    // For Users
    app.get('/users', async(req, res)=>{
      const allUsers = req.body;
      const result = await usersCollections.find(allUsers).toArray()
      res.send(result)
    })
    app.post('/users', async(req, res)=>{
      const users = req.body;
      const result = await usersCollections.insertOne(users)
      res.send(result)
    })
    app.patch('/users', async(req, res)=>{
      const newUser = req.body;
      const filter = {email: newUser?.email}
      const updatedDocs = {
        $set: {
          lastSignInTime : newUser?.lastSignInTime
        }
      }
      const result = await usersCollections.updateOne(filter, updatedDocs)
      res.send(result)
    })
    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollections.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('This is my Coffee Store Server.')
})


app.listen(port, ()=>{
    console.log(`This is my Coffee store Server is On : ${port}`)
})