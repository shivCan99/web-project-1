const express = require('express')
const router = express.Router()

const jsonwt = require('jsonwebtoken')
// const db = settings.mongoDBUrl;
const { MongoClient, ObjectId } = require('mongodb');
const settings = require("../../config/settings")
const client = new MongoClient(settings.mongoDBUrl);


router.get('/', (req, res) => res.send('Profile related routes.'))

// get all records. URL : /api/profile/get
router.get('/get', async (req, res) => {
    // fetch data from db
    const sale = await Sales.find({})
    try {
        res.status(200).send(sale)
    }
    catch {
        res.status(500).send(error)
    }
})
//get a particular record
router.get('/sales/:id', async (req, res) => {
    const db = client.db('sample_supplies');
    const salesCollection = db.collection('sales');
    const id = new ObjectId(req.params.id);
    const sale = await salesCollection.findOne({ _id: id });
    res.send(sale);
  });


//adding data inside the database using req.body
//const settings = require('../../config/settings')
const { default: mongoose } = require('mongoose')
router.use(express.json());

router.post('/sales', async (req, res) => {
  const newSale = req.body;
  const db = client.db('sample_supplies');
  const salesCollection = db.collection('sales');
  await salesCollection.insertOne(newSale);
  res.status(201).send('Sale added to database');
});

//updating sales data
router.put('/sales/:id', async (req, res) => {
    const db = client.db('sample_supplies');
    const salesCollection = db.collection('sales');
    const id = req.params.id;
    const update = { $set: req.body };
    const result = await salesCollection.updateOne({ _id: new ObjectId(id) }, update);
    res.send("data updated");
  });

// deleting a person. URL: /api/profile/delete/:username
router.delete('/delete/_id', (req, res) => {
    Sales
        .deleteOne({_id: req.params._id})
        .exec()
        .then(() => {
            res.send('Sales Data Deleted.')
        })
        .catch(err => res.status(500).send(err.message))
})
router.delete('/sales/:id', async (req, res) => {
    const db = client.db('sample_supplies');
    const salesCollection = db.collection('sales');
    const id = req.params.id;
    const result = await salesCollection.deleteOne({ _id: new ObjectId(id) });
    res.send("Sales Data Deleted");
  });
  


module.exports = router