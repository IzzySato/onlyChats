const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  //const { username } = req;
  res.render('chat', { username: 'Izzy test' });

  // if (req.isAuthenticated()) {
  //   const { username } = req.user;
  //   res.render('chat');
  // } else {
  //   res.redirect('login', { username });
  // }
});

module.exports = router;