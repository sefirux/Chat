const Router = require('express').Router();
const {User} = require('../libs/ChatDatabase');

Router.get('/id/:id', (req, res) => {
    if(!req.session.userData){
        res.redirect('/');
        return;
    }
    User.findById(req.params.id, (err, user) => {
        if(err){
            req.session.error = err.message;
            res.redirect('/');
            return;
        }
        if(req.params.id === req.session.userData.id){
            res.render('my-profile', {
                layout: 'logged-user',
                userData: user
            });
        } else {
            res.render('profile', {
                layout: 'logged-user',
                userData: user
            });
        }
    });
});

Router.get('/id/:id/config', (req, res) => {
    if(!(req.session.userData && req.params.id === req.session.userData.id)){
        res.redirect('/');
        return;
    }
    User.findById(req.params.id, (err, user) => {
        if(err){
            req.session.error = err.message;
            res.redirect('/');
            return;
        }
        res.render('profile-config', {
            layout: 'logged-user',
            userData: user
        });
    });
});

module.exports = Router;