const express = require('express');
const passport = require('passport'); 
const router = express.Router();

//GET load the login page
router.get('/', (req, res, next) => {
  res.render('login');
});

// //POST login user
router.post('/',(req,res,next)=>{
  passport.authenticate('local',{
      successRedirect :'/index',
      failureRedirect : '/login',
      failureFlash:true
  })(req,res,next);
});


module.exports = router;