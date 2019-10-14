const Router = require('express').Router();
const { User, Room } = require('../libs/ChatDatabase');

Router.get('/id/:id', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }
    User.findUserById(req.params.id, (err, user) => {
        if (err) {
            req.session.error = err;
            res.redirect('/');
            return;
        }
        if (req.params.id === req.session.user._id) {
            res.render('my-profile', {
                layout: 'logged-user',
                user: user
            });
        } else {
            res.render('profile', {
                layout: 'logged-user',
                user: user
            });
        }
    });
});

Router.get('/id/:id/config', (req, res) => {
    if (!(req.session.user && req.params.id === req.session.user._id)) {
        res.redirect('/');
        return;
    }
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.session.error = err.message;
            res.redirect('/');
            return;
        }
        res.render('profile-config', {
            layout: 'logged-user',
            user: user
        });
    });
});

Router.post('/id/:id/config', (req, res) => {
    if (!(req.session.room && req.params.id === req.session.room._id)) {
        res.redirect('/');
        return;
    }
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.session.error = err.message;
            res.redirect('/');
            return;
        }
        res.render('profile-config', {
            layout: 'logged-user',
            user: user
        });
    });
});

module.exports = Router;