const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('index', { title: 'OnlyChats'});
    } else {
        res.redirect('login');
    }
});

module.exports = router;
