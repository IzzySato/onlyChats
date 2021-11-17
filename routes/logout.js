const express = require('express');
const router = express.Router();

//GET logout and back to the login page
router.get('/', (req, res) => {
  req.logout();
  req.flash('success_msg',"You are logged Out");
  res.redirect('login');
});

module.exports = router;