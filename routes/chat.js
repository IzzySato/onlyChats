const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  res.render('chat');
});

module.exports = router;