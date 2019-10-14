const imageUpload = require('../libs/imageStorage');
const { resizeAvatar } = require('../libs/imageResize');
const { User } = require('../libs/ChatDatabase');
const router = require('express').Router();
const profilesRouter = require('./profiles');
const roomsRouter = require('./rooms');
const express = require('express');
const path = require('path');

router.use('/profile', profilesRouter);
router.use('/room', roomsRouter);
router.use('/public', express.static(path.join(__dirname, '../uploads/images')));
router.use('/default', express.static(path.join(__dirname, '../uploads/default')));

router.get('/', (req, res) => {
    if (!req.session.user) {
        res.render('home');
        return;
    }
    res.render('home', {
        user: req.session.user,
        pageError: req.session.error,
        layout: 'logged-user'
    });
    req.session.error = null;
});

router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('login', {
        title: "Signup",
        action: "/signup",
        signup: true,
        loginError: req.session.error
    });
    req.session.error = null;
});

router.post('/signup', (req, res) => {
    imageUpload.single('avatar')(req, res, err => {
        if (err) {
            req.session.error = err.message;
            res.redirect('/signup');
            return;
        }

        resizeAvatar(req.file, (err, imgUrl) => {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatarUrl: imgUrl
            });

            User.saveUser(newUser, (err, user) => {
                if (err) {
                    req.session.error = err;
                    res.redirect('/signup');
                    return;
                }
                req.session.user = user;
                res.redirect('/');
            });
        });
    });
});

router.get('/signin', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('login', {
        title: "Signin",
        action: "/signin",
        loginError: req.session.error
    });
    req.session.error = null;
});

router.post('/signin', (req, res) => {
    User.findUser(req.body.email, req.body.password, (err, user) => {
        if (err) {
            req.session.error = err;
            res.redirect('/signin');
            return;
        }

        req.session.user = user;
        res.redirect('/');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;