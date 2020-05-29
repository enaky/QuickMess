const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const utilities = require('./modules/utilities.js');
const routes = require('./modules/routes.js');

const app = express();
const port = 2014;


//set the express.static middleware
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');                      // directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.use(expressLayouts);                            // suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(express.static('public'))                   // directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(bodyParser.json());                         // corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.urlencoded({extended: true}));   // utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.get('/', routes.index);
app.get('/register', routes.registerGet);
app.post('/register', routes.registerPost);
app.get('/inbox', routes.inbox);
app.get('/login', routes.login);


//----------------------------------SOCKET PART----------------------------------

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

//integrating socketio
socket = io(http);
socket.on("connection", socket => {
    const socketId = socket.id;
    const clientIp = socket.request.connection.remoteAddress;

    console.log(socketId);
    console.log(clientIp);
    socket.on("chat message", function(msg) {
        console.log("message: " + msg);

        //broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg });

        //save chat to the database

    });
});

http.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:2014`));