const imageUpload = require('../libs/imageStorage');
const resize = require('../libs/imageResize');
const { User } = require('../libs/ChatDatabase');
const router = require('express').Router();
const roomsRouter = require('./rooms');
const express = require('express');
const path = require('path');


router.use('/rooms', roomsRouter);
router.use('/public', express.static(path.join(__dirname, '../uploads/images')));

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
        signup: true,
        loginError: req.session.error
    });
    req.session.error = null;
});

router.post('/signup', imageUpload.single('avatar'), (req, res) => {
    resize(req.file, req.file.fieldname, (err, imgUrl) => {
        if(err){
            req.session.error = err;
            res.redirect('/signup');
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatarUrl: imgUrl
            });

            User.saveUser(newUser, (err, user) => {
                if (user) {
                    req.session.userData = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        avatarUrl: user.avatarUrl
                    };
                    res.redirect('/');
                } else {
                    req.session.error = err;
                    res.redirect('/signup');
                }
            });
        }
    });
});

router.get('/signin', (req, res) => {
    res.render('login', {
        title: "Signin",
        action: "/signin",
        loginError: req.session.error
    });
    req.session.error = null;
});

router.post('/signin', (req, res) => {
    User.findUser(req.body.email, req.body.password, (err, user) => {
        if (user) {
            req.session.userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl
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