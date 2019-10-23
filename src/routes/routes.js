const User = require('../models/User');
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
})

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
})

router.post('/signup', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const user = await User.saveUser(newUser);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        req.session.error = err;
        res.redirect('/signup');
    }
})

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
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        req.session.error = err;
        res.redirect('/signin');
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;