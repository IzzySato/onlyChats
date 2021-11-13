const express = require('express');
const router = express.Router();

//GET load the login page
router.get('/', (req, res, next) => {
  res.render('login');
});

//POST login user
router.post('/', (req, res) => {
  const user = new req.User({
    username: req.body.username,
    password: req.body.password
  });
  try{
    req.login(user, (err) => {
      if(err) console.log(err);
      else{
        req.passport.authenticate('local')(req, res, () => {
          res.json({url: '/index'});
        });
      }
    });
  }catch(error){
    console.log(error);
  }
});

module.exports = router;