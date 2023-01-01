const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqgfx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('services')
        const orderCollection = client.db('geniusCarOrder').collection('orderCollection')
        
        app.get('/services', async (req,res)=>{
            const query = {};
            const curser = serviceCollection.find(query);
            const services = await curser.toArray();
            res.send(services)
        })

        app.get('/service/:id' , async(req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        app.post('/service', async(req,res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result)
        })

        app.delete('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/order', async (req,res)=>{
                const order = req.body;
                const result = await orderCollection.insertOne(order)
                res.send(result)
        })
        

        app.get('/order', async(req,res)=>{
            const email = req.query.email;
            console.log(email)
            const query ={email: email}
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

    }
    finally{

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})