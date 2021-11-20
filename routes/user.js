const express = require('express');
const router = express.Router();

//GET load register page
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { user = [] } = req;
    const { name = '' } = (user[0] || {});
    res.render('user', { name });
  } else {
    res.redirect('login');
  }
});

module.exports = router;