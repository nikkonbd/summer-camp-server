const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

// MiddleWare
app.use(cors());
app.use(express.json());

// 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.qylqrma.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db("summerCampDB").collection("users");
        const classesCollection = client.db("summerCampDB").collection("classes");
        const instructorsCollection = client.db("summerCampDB").collection("instructors");
        const selectCollection = client.db("summerCampDB").collection("selects");

        // Users Collection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already Exist' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // All class Api
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        // All instructor Api
        app.get('/instructors', async (req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result);
        })



        // get selected classes
        app.get('/selects', async (req, res) => {
            const email = req.query.email;
            console.log(email);

            if (!email) {
                res.send([]);
            }
            const query = { email: email };
            const result = await selectCollection.find(query).toArray();
            res.send(result);
        })


        // Select collection
        app.post('/selects', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await selectCollection.insertOne(item);
            res.send(result);
        })

        app.delete('/selects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await selectCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// 

app.get('/', (req, res) => {
    res.send('summer camp school start')
})

app.listen(port, () => {
    console.log(`school is start on port ${port}`);
})