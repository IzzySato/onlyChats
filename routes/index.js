// const express = require('express');
// const router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'OnlyChats'});
// });

// module.exports = router;


//Gaurav's code-------------------------------------------

const express = require('express');
const router = express.Router();


//Welcome Page
router.get('/',(req,res)=>{
    res.render('index', { title: 'OnlyChats'});
})

//Login Page
router.get('/login',(req,res)=>{
    res.send('Welcome to Login Page');
})

//Register Page
router.get('/register',(req,res)=>{
    res.send(`Welcome to register Page`)
})

module.exports = router;
