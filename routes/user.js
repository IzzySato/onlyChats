const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  res.render('user', { username: 'username'});
});

module.exports = router;