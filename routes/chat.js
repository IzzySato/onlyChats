const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  //const { username } = req;
  //res.render('chat', { username: 'Izzy test' });
  const { name } = req;c
  console.log(req);
  res.render('chat', { username: name});

  // if (req.isAuthenticated()) {
  //   const { name } = req;
  //   console.log(req);
  //   res.render('chat', { username: name});
  // } else {
  //   res.redirect('login', { username });
  // }
});

module.exports = router;