const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        const { user = [] } = req;
        const { email = '' } = (user[0] || {});
        res.render('index', { title: 'OnlyChats', userEmail: email});
    } else {
        res.redirect('login');
    }
});

module.exports = router;
