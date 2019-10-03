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
        titulo: "Signup",
        action: "/signup",
        name: true
    });
});

router.post('/signup', (req, res) => {
    const data = req.body;
    const newUser = new User(data.name, data.email, data.password);
    chatdb.saveUser(newUser, (err, dbRes) => {
        if (dbRes) {
            req.session.userData = {
                id: dbRes.id,
                name: dbRes.name,
                email: dbRes.email
            };
            res.redirect('/');
        } else {
            res.redirect('/signup');
        }
    });
});

router.get('/signin', (req, res) => {
    res.render('login', {
        titulo: "Signin",
        action: "/signin"
    });
});

router.post('/signin', (req, res) => {
    console.log(req.body);
    const data = req.body;
    chatdb.findUser(new User(data.name, data.email, data.password), (err, dbRes) => {
        if (dbRes) {
            req.session.userData = {
                id: dbRes.id,
                name: dbRes.name,
                email: dbRes.email
            };
            res.redirect('/');
        } else {
            res.redirect('/signin');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/chat', (req, res) => {
    if(req.session.userData){
        res.render('chat', {
            userData: req.session.userData,
            layout: 'logged-user',
            chatOn: true
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;