const express = require('express');
const router = express.Router();

//GET logout and back to the login page
router.get('/', (req, res) => {
  req.logout();
  res.redirect('/signup');
});

module.exports = router;