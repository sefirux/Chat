const router = require('express').Router();
const { Room } = require('../libs/ChatDatabase');
const { resizeCover } = require('../libs/imageResize');
const imageUpload = require('../libs/imageStorage');

const MAX_ROOM_LOAD = 2;

router.get('/new', (req, res) => {
    if (!req.session.userData) {
        res.redirect('/');
        return;
    }

    res.render('new-room', {
        userData: req.session.userData,
        roomError: req.session.error,
        layout: 'logged-user',
        roomOn: false
    });
    req.session.error = null;
});

router.post('/new', async (req, res) => {
    if (!req.session.userData) {
        res.redirect('/');
        return;
    }

    const userData = req.session.userData;

    imageUpload.single('front')(req, res, err => {
        if (err) {
            req.session.error = err.message;
            res.redirect('new');
            return;
        }

        resizeCover(req.file, (err, coverUrl) => {
            const room = new Room({
                name: req.body.name,
                admin: {
                    _id: userData._id,
                    name: userData.name
                },
                description: req.body.description,
                coverUrl: coverUrl
            });

            Room.saveRoom(room, (err, room) => {
                if (err) {
                    req.session.error = err;
                    res.redirect('new');
                    return;
                }
                res.redirect(`room/${room._id}`);
            });
        });
    });
});

router.get('/room/:id', (req, res) => {
    if (!req.session.userData) {
        res.redirect('/');
        return;
    }

    Room.findById(req.params.id, (err, room) => {
        if (err) {
            req.session.error = err;
            res.redirect('/find');
            return;
        }
        req.session.roomData = {
            id: room._id,
            name: room.name,
            coverUrl: room.coverUrl
        };
        res.render('room', {
            userData: req.session.userData,
            layout: 'logged-user',
            roomData: room,
            roomOn: true
        });
    })
});

router.get('/find', (req, res) => {
    if (!req.session.userData) {
        res.redirect('/');
        return;
    }
    res.redirect('find/0');
});

router.get('/find/:page', (req, res) => {
    if (!req.session.userData) {
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
                userData: req.session.userData,
                page: page,
                rooms: rooms,
                roomOn: false,
                findError: req.session.error
            };
            req.session.error = null;
            res.render('find-room', data);
        });
    });
});


module.exports = router;