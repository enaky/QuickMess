const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const routes = require('./modules/routes/routes.js');
const inbox_init = require('./modules/inbox/inbox.js')

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
app.get('/chat', routes.inbox);
app.get('/login', routes.loginGet);
app.get('/logout', routes.logout);
app.get('/discover', routes.discoverGet);
app.get('/friends', routes.friendsGet);
app.get('/view-profile', routes.viewProfile);


app.post('/', routes.indexPost);
app.post('/login', routes.loginPost);
app.post('/register', routes.registerPost);
app.post('/discover', routes.discoverPost);
app.post('/friendship-notification', routes.friendshipNotification);
app.post('/remove-friend', routes.friendshipRemove);
app.post('/search_people', routes.searchPeoplePost);
app.post('/post-delete', routes.deletePost);
app.post('/search-friend', routes.searchFriendPost);


//----------------------------------SOCKET PART----------------------------------

//require the http module
const http = require("http").Server(app);

inbox_init["inbox_socket_init"](http)

http.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:2014`);
    console.log(`Login http://localhost:2014/login`);
    console.log(`Register http://localhost:2014/register`);
    console.log(`Discover http://localhost:2014/discover`);
    console.log(`Chat http://localhost:2014/chat`);
});