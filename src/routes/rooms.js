const router = require('express').Router();
const { Room } = require('../libs/ChatDatabase');
const { uploadImg, getImgUrl } = require('../libs/storage');

const MAX_ROOM_LOAD = 2;

router.get('/new', (req, res) => {
    const userData = req.session.userData;
    if (!userData) return res.redirect('/');

    res.render('new-room', {
        userData: userData,
        error: req.session.error,
        layout: 'logged-user',
        roomOn: false
    });

    req.session.error = null;
});

router.post('/new', uploadImg.single('photo'), async (req, res) => {
    const userData = req.session.userData;
    if (!userData) return res.redirect('/');

    const room = new Room({
        name: req.body.name,
        admin: {
            _id: userData._id,
            name: userData.name
        },
        description: req.body.description,
        imgUrl: getImgUrl(req.file)
    });

    Room.saveRoom(room, (err, room) => {
        if (room) {
            res.redirect(`room/${room._id}`);
        } else {
            req.session.error = err;
            res.redirect('new');
        }
    });
});

router.get('/room/:id', (req, res) => {
    const userData = req.session.userData;
    if (!userData) return res.redirect('/');

    const roomId = req.params.id;

    Room.findById(roomId, (err, room) => {
        if (room) {
            req.session.roomData = {
                id: room._id,
                name: room.name,
                imgUrl: room.imgUrl
            };
            res.render('room', {
                userData: userData,
                layout: 'logged-user',
                roomData: room,
                roomOn: true
            });
        } else {
            console.log(err);
            res.redirect('/');
        }
    })
});

router.get('/find', (req, res) => {
    const userData = req.session.userData;
    if (!userData) return res.redirect('/');
    res.redirect('find/0');
});

router.get('/find/:page' , (req, res) => {
    const userData = req.session.userData;
    if (!userData) return res.redirect('/');

    const page = req.params.page? parseInt(req.params.page) : 0;

    Room.countDocuments((err, count) => {
        Room.loadRooms({date: 1}, page * MAX_ROOM_LOAD, MAX_ROOM_LOAD, (err, rooms) => {
            if (rooms) {
                let pagesData = []; //ROOMS PAGES
                for(i = 0; i < count / MAX_ROOM_LOAD; i++){
                    pagesData.push ({ url: `${i}` });
                }
                const data = {
                    layout: 'logged-user',
                    pagesData: pagesData,
                    userData: userData,
                    page: page,
                    rooms: rooms,
                    roomOn: false
                };
                res.render('find-room', data);
            } else {
                console.error(err);
                res.redirect('/');
            }
        });
    });
    
    /*
    Room.find((err, rooms) => {
        if (rooms) {
            res.render('find-room', {
                userData: userData,
                rooms: rooms,
                layout: 'logged-user',
                roomOn: false
            });
        } else {
            console.error(err);
            res.redirect('/');
        }
    });
    */
});


module.exports = router;