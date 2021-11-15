const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  res.render('signup');
});

//POST register a new user
router.post('/', (req, res) => {
});

module.exports = router;