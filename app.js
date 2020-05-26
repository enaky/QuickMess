const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const utilities = require('./modules/utilities.js');

const app = express();
const port = 2014;

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

app.get('/', async (req, res) => {
    console.log('cookies: ', req.cookies);
    let username = null;
    if (req.session.user) {
        username = req.session.user.firstname;
    }
    res.render('index', {user: username});
});


app.get('/register', (req, res) => {
    res.render('register');
});


app.get('/login', (req, res) => {
    if (req.session.user) {   //if logged
        res.redirect("/");
        return;
    }
    let user = req.cookies["autentificare_user"];
    let username = null;
    if (user) {
        username = user["nume"];
    }
    let messageError = false;
    if (typeof req.cookies.messageError != "undefined" && req.cookies.messageError === "yes") {
        messageError = true;
        res.clearCookie("messageError");
    }
    res.render("login", {user: username, messageError: messageError});
});


//handle invalid urls
app.use((req, res) => {
    let client_ip = req.connection.remoteAddress;
    console.log("Client " + client_ip + " is requesting the resource: " + req.url);
    if (security.needToBlockIp(client_ip)){
        res.sendStatus(405)
    } else {
        res.redirect("/");
    }
});


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:2014`));