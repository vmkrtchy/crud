var express = require("express");
var path = require("path");
const bodyParser = require('body-parser');
var app = express();
const { ObjectId } = require('mongoose').Types;

const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://vahanmkrtchyang:Yuri2023@cluster0.hb6fmq0.mongodb.net/tumo_prd';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));

app.get("/", function (req, res) {
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            let result = await mongoose.connection.db.collection('prd').find().toArray()
            res.render('../public/form.ejs', {
                obj: result
            });
        } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    })
});

app.post('/addName', async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const des = req.body.description;
    const uuid = req.body.uuid;
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        console.log('Connected to MongoDB!');
        try {
            let result = await mongoose.connection.db.collection('prd').insertOne({
                name: name,
                price: price,
                image: image,
                description: des,
                uuid: uuid
            })
            res.redirect('/');
        } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    })
});

app.get("/delete/:id", function (req, res) {
 var id = req.params.id;
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            let result = await mongoose.connection.db.collection('prd').deleteOne({_id: new ObjectId(id)});
            res.redirect('/');
        } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    })
});

app.get("/update/:id", function (req, res) {
    var id = req.params.id;
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            let result = await mongoose.connection.db.collection('prd').findOne({_id: new ObjectId(id)});
            res.render('../public/update.ejs', {
                obj: result
            });
        } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    })
});


app.post("/updateData", function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const des = req.body.description;
    const uuid = req.body.uuid;
    const id = req.body.id;

    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error:'));

    db.once('open', async () => {
        console.log('Connected to MongoDB!');

        try {
            let result = await mongoose.connection.db.collection('prd').updateOne(
                { _id: new ObjectId(id) },
                { $set: { name: name, price: price, image: image, description: des, uuid: uuid } }
            );

            res.redirect("/");
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});



app.listen(3000, function () {
    console.log("Example is running on port 3000");
});
