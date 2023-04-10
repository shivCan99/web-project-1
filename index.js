const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

//const uri = 'mongodb+srv://Shivam_HUmber:shivam@cluster0.kzkacae.mongodb.net/?retryWrites=true&w=majority'; //this should be in config

const settings = require("./config/settings")
const client = new MongoClient(settings.mongoDBUrl);

async function connect() {
  await client.connect();
  console.log('Connected to MongoDB');
}

connect();

const express = require('express');
const app = express();
const port = process.env.PORT;

//searching data with different fields using EJS
app.set('view engine', 'ejs');
app.get('/sales/search', async (req, res) => {
    const db = client.db('sample_supplies');
    const salesCollection = db.collection('sales');
    const id = req.query.id;
    const name = req.query.name;
    const storeLocation = req.query.storeLocation;
    const email = req.query.email;
    const query = {
      $or: [
        { _id: new ObjectId(id) },
        { 'customer.email': email },
        { 'customer.gender': name },
        { storeLocation: storeLocation }
      ]
    };
    const results = await salesCollection.find(query).toArray();
    res.render('search', { results });
  });

// importing routes
const profile = require('./routes/api/person')
const auth = require('./routes/api/auth')

app.get('/', (req, res) => {
    res.send('Week 10 code goes from here')
})

// mapping the imported routes
app.use('/api/profile', profile)

app.use('/api/auth', auth)


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

