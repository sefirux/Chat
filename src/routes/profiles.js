const myAccount = require('../middlewares/myAccount');
const router = require('express').Router();
const User = require('../models/User');

router.use((req, res, next) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
})

router.get('/id/:id', async (req, res) => {
    try {
        const user = User.findUserById(req.params.id);
        if (req.params.id === req.session.user._id)
            res.render('my-profile', {
                layout: 'logged-user',
                user: user,
            });
        else
            res.render('profile', {
                layout: 'logged-user',
                user: user,
            });
    } catch (err) {
        req.session.error = err;
        res.redirect('/');
    }
})

router.get('/id/:id/config', myAccount, async (req, res) => {
    try {
        const user = await User.findUserById(req.params.id);
        res.render('profile-config', {
            layout: 'logged-user',
            user: user
        });
    } catch (err) {
        req.session.error = err;
        res.redirect('/');
    }
})

router.post('/id/:id/config', myAccount, async (req, res) => {
    try {
        const user = await User.findUserById(req.params.id);
        res.render('profile-config', {
            layout: 'logged-user',
            user: user
        });
    } catch (err) {
        req.session.error = err;
        res.redirect('/');
    }
})

module.exports = router;