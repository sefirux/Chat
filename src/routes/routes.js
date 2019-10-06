const router = require('express').Router();
const roomsRouter = require('./rooms');
const User = require('../models/User');
const chatdb = require('../libs/chatdb');

router.use('/rooms', roomsRouter);

router.get('/', (req, res) => {
    const userData = req.session.userData;
    if (userData) {
        res.render('home', {
            userData: userData,
            layout: 'logged-user'
        });
    } else {
        res.render('home');
    }
});

router.get('/signup', (req, res) => {
    res.render('login', {
        title: "Signup",
        action: "/signup",
        name: true,
        error: req.session.error
    });
    req.session.error = null;
});

router.post('/signup', (req, res) => {
    const newUser = new User(req.body);
    chatdb.saveUser(newUser, (err, dbRes) => {
        if (dbRes) {
            req.session.userData = {
                id: dbRes._id,
                name: dbRes.name,
                email: dbRes.email
            };
            res.redirect('/');
        } else {
            req.session.error = err;
            res.redirect('/signup');
        }
    });
});

router.get('/signin', (req, res) => {
    res.render('login', {
        title: "Signin",
        action: "/signin",
        error: req.session.error
    });
    req.session.error = null;
});

router.post('/signin', (req, res) => {
    const user = new User(req.body);
    chatdb.findUser({
        email: user.email,
        password: user.password
    }, (err, dbRes) => {
        if (dbRes) {
            req.session.userData = {
                id: dbRes._id,
                name: dbRes.name,
                email: dbRes.email
            };
            res.redirect('/');
        } else {
            req.session.error = err;
            res.redirect('/signin');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;