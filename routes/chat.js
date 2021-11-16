const express = require('express');
const router = express.Router();

const checkAuthenicated = (req,res,next) => {
  if(req.isAuthenticated()){
      res.set('Cache-Control','no-cache,private,no-store,must-relative,post-check=0,pre-check=0');
      return next();
  }
  else{
      res.redirect('/users/login');
  }
}

//GET load register page
router.get('/', checkAuthenicated, (req, res) => {
  res.render('chat');
});

module.exports = router;