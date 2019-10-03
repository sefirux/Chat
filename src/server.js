const exphbrs = require('express-handlebars');
const expSession = require('express-session');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const ip = require('ip');

const router = require('./routes/routes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(expSession({
    secret: '2A462D4A614E645266556A586E327235',
    resave: false,
    saveUninitialized: true
}));

app.set('port', process.env.PORT || 4040);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbrs({
    defaultLayout: 'main'
}));

app.use(router);

const server = app.listen(app.get('port'), () => {
    console.log(`Server running at http://${ip.address()}:${app.get('port')}`);
});

require('./sockets')(socketIO(server));