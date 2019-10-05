const mongoClient = require('mongodb').MongoClient;

const ERR_USER_DOES_NOT_EXIST = 'This user does not exist or incorrect password';
const ERR_USER_ALREADY_EXIST = 'User already exists';

const dbPort = 27017;
const dbName = 'chatdb';
const dbURL = `mongodb://localhost:${dbPort}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
};

const usersCollectionName = 'users';
const chatCollectionName = 'chats';

const findUser = (userData, callBack) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            console.error(err);
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const userCollection = chatdb.collection(usersCollectionName);
            userCollection.findOne({
                    email: userData.email,
                    password: userData.password
                })
                .then(user => {
                    if (!user) {
                        callBack(ERR_USER_DOES_NOT_EXIST, null);
                    } else {
                        callBack(null, user);
                    }
                })
                .catch(err => callBack(err, null));

            client.close();
        }
    })
};

const findUsersByNameRegex = (string, maxUsers, callBack) => {
    mongoClient.connect(dbURL, dbConfig, async (err, client) => {
        if (err) {
            console.error(err);
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const userCollection = chatdb.collection(usersCollectionName);
            userCollection.find({"name": {$regex: `${string}`, $options:"i"}},{name:1})
                .limit(maxUsers)
                .toArray((err, users) => callBack(err, users));

            client.close();
        }
    })
};

const saveUser = (user, callBack, update) => {
    mongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (err) {
            console.error(err);
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const userCollection = chatdb.collection(usersCollectionName);
            userCollection.findOne({email: user.email})
                .then(oldUser => {
                    if (oldUser && !update) {
                        callBack(ERR_USER_ALREADY_EXIST, null);
                    } else {
                        userCollection.insertOne(user);
                        userCollection.findOne(user)
                            .then(user => callBack(null, user))
                            .catch(err => callBack(err, null));
                        client.close();
                    }
                })
                .catch(err => {
                    callBack(err, null)
                    client.close();
                });
        }
    })
};

const findRoom = (roomData, callBack) => {

};

const saveRoom = (room, callBack, update) => {

};

module.exports = {
    saveUser,
    findUser,
    findUsersByNameRegex
};