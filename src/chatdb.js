const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const ERR_USER_DOES_NOT_EXIST = 'This user does not exist or incorrect password';
const ERR_USER_ALREADY_EXIST = 'User already exists';
const ERR_ROOM_ALREADY_EXIST = 'Room already exists';
const SUCCESS = 'Success';

const dbPort = 27017;
const dbName = 'chatdb';
const dbURL = `mongodb://localhost:${dbPort}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
};

const usersCollectionName = 'users';
const roomsCollectionName = 'rooms';

const findElement = (data, collectionName, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(collectionName);
            collection.findOne(data)
                .then(element => callBack(null, element))
                .catch(err => callBack(err, null));
            client.close();
        }
    })
};

const findElements = (data, collectionName, callBack, limit) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(collectionName);
            if (limit) {
                collection.find(data).limit(limit).toArray((err, elements) => callBack(err, elements));
            } else {
                collection.find(data).toArray((err, elements) => callBack(err, elements));
            }
            client.close();
        };
    });
};

const saveElement = (element, collectionName, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(collectionName);
            collection.insertOne(element);
            collection.findOne(element)
                .then(newElement => callBack(null, newElement))
                .catch(err => callBack(err, null));
            client.close();
        }
    })
};

const updateElement = (query, newValues, collectionName, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(collectionName);
            collection.updateOne(query, {
                    $set: newValues
                })
                .then(res => callBack(null, SUCCESS))
                .catch(err => callBack(err, null));
            client.close();
        }
    })
};

const findUser = (userData, callBack) => {
    findElement(userData, usersCollectionName, (err, user) => {
        if (!user) {
            callBack(ERR_USER_DOES_NOT_EXIST, null);
        } else {
            callBack(null, user);
        }
    });
};

const findUserById = (id, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(usersCollectionName);
            collection.findOne({
                    _id: new ObjectId(id)
                })
                .then(element => callBack(null, element))
                .catch(err => callBack(err, null));
            client.close();
        }
    })
};

const findUsersByNameRegex = (string, maxUsers, callBack) => {
    mongoClient.connect(dbURL, dbConfig, async (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const userCollection = chatdb.collection(usersCollectionName);
            userCollection.find({
                    "name": {
                        $regex: `${string}`,
                        $options: "i"
                    }
                }, {
                    name: 1
                })
                .limit(maxUsers)
                .toArray((err, users) => callBack(err, users));

            client.close();
        }
    });
};

const saveUser = (user, callBack) => {
    findElement({
        email: user.email
    }, usersCollectionName, (err, oldUser) => {
        if (err) {
            callBack(err, null);
        } else if (oldUser) {
            callBack(ERR_USER_ALREADY_EXIST, null);
        } else {
            saveElement(user, usersCollectionName, callBack);
        }
    });
};

const updateUser = (userData, newValues, callBack) => {
    updateElement(userData, newValues, usersCollectionName, callBack);
}

const findRoom = (roomData, callBack) => {
    findElement(roomData, roomsCollectionName, (err, room) => {
        if (err) {
            callBack(err, null);
        } else {
            callBack(null, room);
        }
    });
};

const findRoomById = (id, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(roomsCollectionName);
            collection.findOne({
                    _id: new ObjectId(id)
                })
                .then(element => callBack(null, element))
                .catch(err => callBack(err, null));
            client.close();
        }
    })
};

const findRooms = (data, limit, callBack) => {
    findElements(data, roomsCollectionName, callBack, limit);
}

const saveRoom = (room, callBack) => {
    findElement({
        name: room.name
    }, roomsCollectionName, (err, oldRoom) => {
        if (err) {
            callBack(err, null);
        } else if (oldRoom) {
            callBack(ERR_ROOM_ALREADY_EXIST, null);
        } else {
            saveElement(room, roomsCollectionName, callBack);
        }
    });
};

const updateRoom = (roomData, newValues, callBack) => {
    updateElement(roomData, newValues, roomsCollectionName, callBack);
};

const addMesaggeToRoom = (message, roomId, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const collection = chatdb.collection(roomsCollectionName);
            collection.findOneAndUpdate({_id: new ObjectId(roomId)}, {$push:{messages: message}}, {returnOriginal: false})
                .then(res =>{
                    const msg = res.value.messages[res.value.messages.length - 1];
                    callBack(null, msg);
                })
                .catch(err => callBack(err, null));
            client.close();
        }
    });
};

module.exports = {
    saveUser,
    updateUser,
    findUser,
    findUserById,
    findUsersByNameRegex,
    findElements,
    saveRoom,
    findRoom,
    findRooms,
    findRoomById,
    updateRoom,
    addMesaggeToRoom
};