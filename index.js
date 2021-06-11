const express = require('express')
const cors = require('cors')
const port = 5000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.566ly.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(express.json());
app.use(cors());







const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("babuiShop").collection("Products");
    const ordersCollection = client.db("babuiShop").collection("orders");


    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })


    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
      })


      
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })
      })

    
      app.post('/productsByKeys',(req, res)=>{
          const productKeys = req.body;
          console.log(productKeys)
          productsCollection.find({key: {$in: productKeys} })
          .toArray((err, documents)=>{
              res.send(documents)
          })
      })


      app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    
});




app.listen(port, () => {
  console.log(`hey i am ok and running on port:${process.env.PORT || port}`)
})