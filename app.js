const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
const { DB_URL } = require("./credentials");

// ========================
// Link to Database
// ========================


// Replace DB_URL with your actual connection string in credentials.js
const connectionString = DB_URL

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('usr-cred')
    const userCollection = db.collection('users')

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================


    app.get('/', (req, res) => {
       
            res.render('index.ejs')
       
      })

    app.get('/userinfo', (req, res) => {
      db.collection('users').find().toArray()
        .then(users => {
          res.render('userinfo.ejs', { users: users})
        })
        .catch(error => console.error(error))
    })

    app.post('/users', (req, res) => {
       userCollection.insertOne(req.body)
        .then(result => {
            console.log('New user account created in the database') ; 
          res.redirect('/userinfo')
        })
        .catch(error => console.error(error))
    })

   
    // ========================
    // Listen
    // ========================
    const port = 3001
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
