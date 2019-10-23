const hdbsHelpers = require('handlebars-helpers');
const expHbrs = require('express-handlebars');
const expSession = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const ip = require('ip');

const sessionConfig = {
    secret: '2A462D4A614E645266556A586E327235',
    resave: false,
    saveUninitialized: true
};

const sessionMiddleware = expSession(sessionConfig);

const chatSocketIO = require('./libs/sockets');
const startDB = require('./libs/ChatDatabase');
const router = require('./routes/routes');

const app = express();

app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(sessionMiddleware);
app.use(router);

app.set('port', process.env.PORT || 4040);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', expHbrs({
    helpers: hdbsHelpers(),
    defaultLayout: 'main'
}));

const server = app.listen(app.get('port'), () => {
    console.log(`Server running at http://${ip.address()}:${app.get('port')}`);
});

chatSocketIO(server, sessionMiddleware);

startDB(mongoose);