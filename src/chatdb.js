const mongoClient = require('mongodb').MongoClient;

const dbPort = 27017;
const dbName = 'chatdb';
const usersCollectionName = 'users';
const dbURL = `mongodb://localhost:${dbPort}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
};

const findUser = (userData, callBack) => {
    mongoClient.connect(dbURL, dbConfig, async (err, client) => {
        if (err) {
            console.error(err);
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const userCollection = chatdb.collection(usersCollectionName);
            userCollection.findOne({ email: userData.email, pass: userData.pass })
                .then(user => {
                    if (!user) {
                        callBack('No exist.', null);
                    } else {
                        callBack(null, user);
                    }
                })
                .catch(err => callBack(err, null));

            client.close();
        }
    })
};

const saveUser = (user, callBack, update) => {
    mongoClient.connect(dbURL, dbConfig, async (err, client) => {
        if (err) {
            console.error(err);
            callBack(err, null);
        } else {
            const chatdb = client.db(dbName);
            const userCollection = chatdb.collection(usersCollectionName);
            const oldUser = await userCollection.findOne({ email: user.email });
            if (oldUser && !update) {
                callBack('User exist.', null);
            } else {
                userCollection.insertOne(user);
                userCollection.findOne(user)
                    .then(user => {
                        callBack(null, user)
                    })
                    .catch(err => callBack(err, null))
            }

            client.close();
        }
    })
};

module.exports = {
    saveUser,
    findUser
};