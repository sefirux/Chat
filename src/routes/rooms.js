const router = require('express').Router();
const Room = require('../models/Room');
const chatdb = require('../libs/chatdb');
const {uploadImg} = require('../libs/storage');

router.get('/new', (req, res) => {
    if (!req.session.userData) return res.redirect('/');
    res.render('new-room', {
        userData: req.session.userData,
        error: req.session.error,
        layout: 'logged-user',
        roomOn: false
    });
    req.session.error = null;
})

router.post('/new', uploadImg.single('photo'), (req, res) => {
    if (!req.session.userData) return res.redirect('/');

    const room = new Room(req.body, req.session.userData.id);
    room.imgUrl = `/public/${req.file.filename}`;

    chatdb.saveRoom(room, (err, newRoom) => {
        if (!err) {
            res.redirect(`room/${newRoom._id}`);
        } else {
            req.session.error = err;
            res.redirect(`new`);
        }
    });
});

router.get('/room/:id', (req, res) => {
    if (req.session.userData) {
        const roomId = req.params.id;
        if (roomId) {
            chatdb.findRoomById(roomId, (err, room) => {
                if (room) {
                    req.session.roomData = {
                        id: room._id,
                        name: room.name,
                        imgUrl: room.imgUrl
                    };
                    res.render('room', {
                        userData: req.session.userData,
                        layout: 'logged-user',
                        roomData: room,
                        roomOn: true
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

router.get('/find', (req, res) => {
    if (req.session.userData) {
        chatdb.findRooms(null, 10, (err, rooms) => {
            if (rooms) {
                res.render('find-room', {
                    userData: req.session.userData,
                    rooms: rooms,
                    layout: 'logged-user',
                    roomOn: false
                });
            }
        })

    } else {
        res.redirect('/');
    }
});

module.exports = router;