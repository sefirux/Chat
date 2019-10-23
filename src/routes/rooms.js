const { resizeCover } = require('../libs/imageResize');
const imageUpload = require('../libs/imageStorage');
const router = require('express').Router();
const User = require('../models/User');
const Room = require('../models/Room');

const MAX_ROOM_LOAD = 8;

router.use((req, res, next) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
})

router.get('/new', (req, res) => {
    res.render('new-room', {
        user: req.session.user,
        roomError: req.session.error,
        layout: 'logged-user',
        roomOn: false
    });
    req.session.error = null;
})

router.post('/new', async (req, res) => {
    const user = req.session.user;

    const newRoom = new Room({
        name: req.body.name,
        adminId: user._id,
        description: req.body.description
    });

    try {
        const room = await Room.saveRoom(newRoom);
        const user = await User.findById(req.session.user._id);
        user.addRoom(room._id);

        res.redirect(`id/${room._id}`);
    } catch (err) {
        req.session.error = err;
        res.redirect('new');
    }
})

router.get('/id/:id', async (req, res) => {
    try {
        const room = await Room.findRoomById(req.params.id);
        req.session.room = room;
        res.render('room', {
            user: req.session.user,
            layout: 'logged-user',
            room: room,
            myRoom: (room.adminId == req.session.user._id)
        });
    } catch (err) {
        req.session.error = err;
        res.redirect('/');
    }
})

router.get('/search', (req, res) => {
    res.redirect('search/0');
})

router.get('/search/:page', async (req, res) => {
    const page = req.params.page ? parseInt(req.params.page) : 0;
    try {
        const count = await Room.countDocuments();
        const rooms = await Room.loadRooms({ date: 1 }, page * MAX_ROOM_LOAD, MAX_ROOM_LOAD);
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
    } catch (err) {
        req.session.error = err;
        res.redirect('/');
    }
})

module.exports = router;