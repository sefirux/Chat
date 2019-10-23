module.exports = function (req, res, next) {
    if(req.params.id !== req.session.user._id){
        res.redirect('/');
    } else {
        next();
    }
}