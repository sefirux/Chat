const router = require('express').Router();
const chatdb = require('../libs/chatdb');
const roomsRouter = require('./rooms');
const User = require('../models/User');
const express = require('express');
const path = require('path');

const {uploadImg} = require('../libs/storage');

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
        error: req.session.error
    });
    req.session.error = null;
});

router.post('/signup', uploadImg.single('avatar'), (req, res) => {
    const newUser = new User(req.body);
    newUser.avatarUrl = `/public/${req.file.filename}`;

    chatdb.saveUser(newUser, (err, dbRes) => {
        if (dbRes) {
            req.session.userData = {
                id: dbRes._id,
                name: dbRes.name,
                email: dbRes.email,
                avatarUrl: dbRes.avatarUrl
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
                email: dbRes.email,
                avatarUrl: dbRes.avatarUrl
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