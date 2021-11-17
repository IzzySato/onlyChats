const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport'); 

//GET load register page
router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;
  console.log(`name ${name} email ${email} pass ${password}`);
  let errors = [];

  try {
    //Check required fields
    if (!name || !email || !password) {
      errors.push({
        msg: 'Please Fill all the fields'
      });
    }

    //Check pass length
    if (password.length < 6) {
      errors.push({
        msg: 'Password must contain more than 6 character'
      });
    }

    if (errors.length > 0) {
      res.render('signup', {
        errors,
        name,
        email,
        password
      });
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      //Hash Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //Set Password to hashed
          newUser.password = hash;
          newUser.save()
            .then(user => {
              try {
                passport.authenticate('local')(req, res, () => {
                  res.json({url: '/index'});
                });
              }catch(err){
                console.log(err);
              }
              // req.flash('success_msg', 'You are now register and can log in')
              // res.json({url: '/index'});
            })
            .catch(err => console.log(err));
        });
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});

module.exports = router;