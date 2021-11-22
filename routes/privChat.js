const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { user = [] } = req;
    const { name = '', email } = (user[0] || {});
    res.render('privChat', { name, email });
  } else {
    res.redirect('login');
  }
});

module.exports = router;