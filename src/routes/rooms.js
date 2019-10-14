const router = require('express').Router();
const { Room, User } = require('../libs/ChatDatabase');
const { resizeCover } = require('../libs/imageResize');
const imageUpload = require('../libs/imageStorage');

const MAX_ROOM_LOAD = 8;

router.get('/new', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }

    res.render('new-room', {
        user: req.session.user,
        roomError: req.session.error,
        layout: 'logged-user',
        roomOn: false
    });
    req.session.error = null;
});

router.post('/new', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }

    const user = req.session.user;

    imageUpload.single('front')(req, res, err => {
        if (err) {
            req.session.error = err.message;
            res.redirect('new');
            return;
        }

        resizeCover(req.file, (err, coverUrl) => {
            const room = new Room({
                name: req.body.name,
                adminId: user._id,
                description: req.body.description,
                coverUrl: coverUrl
            });

            Room.saveRoom(room, (err, room) => {
                if (err) {
                    req.session.error = err;
                    res.redirect('new');
                    return;
                }
                User.findById(req.session.user._id, (err, user) => {
                    user.addRoom(room._id);
                });
                res.redirect(`id/${room._id}`);
            });
        });
    });
});

router.get('/id/:id', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }

    Room.findById(req.params.id, (err, room) => {
        if (err) {
            req.session.error = err;
            res.redirect('/search');
            return;
        }

        req.session.room = room;

        res.render('room', {
            user: req.session.user,
            layout: 'logged-user',
            room: room,
            myRoom: (room.adminId == req.session.user._id)
        });
    })
});

router.get('/search', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }
    res.redirect('search/0');
});

router.get('/search/:page', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }

    const page = req.params.page ? parseInt(req.params.page) : 0;

    Room.countDocuments((err, count) => {
        Room.loadRooms({ date: 1 }, page * MAX_ROOM_LOAD, MAX_ROOM_LOAD, (err, rooms) => {
            if (err) {
                req.session.error = err;
                res.redirect('/');
                return;
            }

            let pagesData = []; //ROOMS PAGES
            for (i = 0; i < count / MAX_ROOM_LOAD; i++) {
                pagesData.push({ url: `${i}` });
            }
            const data = {
                layout: 'logged-user',
                pagesData: pagesData,
                user: req.session.user,
                page: page,
                rooms: rooms,
                roomOn: false,
                findError: req.session.error
            };
            req.session.error = null;
            res.render('search-room', data);
        });
    });
});

module.exports = router;