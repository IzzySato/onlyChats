const express = require('express');
const Friend = require('../models/Friend.js');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { user = [] } = req;
    const { name = '' } = (user[0] || {});
    res.render('addFriend', { name });
  } else {
    res.redirect('login');
  }
});

router.post('/', async (req, res) => {
  console.log('CALLED FRIENds');
  const {
    friendName,
    friendEmail
  } = req.body;
  const { user = [] } = req;
  const { email = '' } = (user[0] || {});
  console.log(`req: ${req}`);
  console.log(`email : ${email}`);
  const friend = {
    friendName,
    friendEmail,
    email
  };

   // console.log(`friend::::  ${friendName} ${friendEmail}`);

  try {
    const newFriend = new Friend(friend);
    newFriend.save();
    res.json({ url: '/index'});
  } catch (err) {
    console.log(err);
  };
});

module.exports = router;