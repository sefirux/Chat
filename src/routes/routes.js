const router = require('express').Router();
const User = require('../models/User');
const chatdb = require('../chatdb');

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
        error: req.session.signupError
    });
    req.session.signupError = null;
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
            req.session.signupError = err;
            res.redirect('/signup');
        }
    });
});

router.get('/signin', (req, res) => {
    res.render('login', {
        title: "Signin",
        action: "/signin",
        error: req.session.signinError
    });
    req.session.signinError = null;
});

router.post('/signin', (req, res) => {
    const user = new User(req.body);
    chatdb.findUser(user, (err, dbRes) => {
        if (dbRes) {
            req.session.userData = {
                id: dbRes._id,
                name: dbRes.name,
                email: dbRes.email
            };
            res.redirect('/');
        } else {
            req.session.signinError = err;
            res.redirect('/signin');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/room', (req, res) => {
    if(req.session.userData){
        res.render('room', {
            userData: req.session.userData,
            layout: 'logged-user',
            roomOn: true
        });
    } else {
        res.redirect('/');
    }
});

router.get('/rooms', (req, res) => {
    if(req.session.userData){
        res.render('rooms');
    }
});

router.post('/new-room', (req, res) => {
    const userData = req.session.userData;
    const newRoomData = req.body;
    if(userData){
        if(newRoomData){

        }
    }
})

module.exports = router;