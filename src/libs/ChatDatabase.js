const dbPort = 27017;
const dbName = 'roomdb';
const dbURI = `mongodb://localhost:${dbPort}/${dbName}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
};

function startDB(mongoose) {
    mongoose.connect(dbURI, dbConfig)
        .then(res => console.log(`Successfuly connected: ${dbURI}`))
        .catch(err => console.log(err));
}

module.exports = startDB;