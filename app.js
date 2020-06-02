const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const session = require('express-session');
const dbSchema = require('./modules/database/dbSchema');
const chatDatabase = require('./modules/database/chatDatabase.js');
const auth = require('./modules/database/auth.js');


const utilities = require('./modules/utilities.js');
const routes = require('./modules/routes/routes.js');

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


//----------------------------------SOCKET PART----------------------------------

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

//integrating socketio
serverSocket = io(http);
let allUsers = {};
serverSocket.on("connection", socket => {
    console.log("Got connected socket Id : " + socket.id);

    const clientIp = socket.request.connection.remoteAddress;

    console.log("Got connected socket Id : " + socket.id);
    socket.on("establish connection", function (user_info) {
        console.log("Stupid socket connection don't event reach here");
        console.log("User Id: " + user_info["user_id"] + " wants to chat with " + user_info["friend_id"]);
        allUsers[user_info["user_id"]] = {"socket": socket, "friend_id": user_info["friend_id"]};
        auth.updateUserStatus(user_info["user_id"], "online").then(() => console.log("Update status online succesfully"));
        //broadcast message to everyone in port:5000 except yourself.
    });

    socket.on("chat message", function (data) {
        console.log("\nMessage: " + data["message"]);
        console.log("Sender: " + data["user_id"]);
        console.log("To: " + data["friend_id"]);

        let message_to_insert = dbSchema.Message({
            message: data["message"],
            sender: data["user_id"],
            receiver: data["friend_id"],
            date: moment()
        });
        chatDatabase.insertMessage(data["user_id"], data["friend_id"], message_to_insert).then(function () {
            console.log("Message Insertion was succesfull")
        });

        //broadcast message to everyone in port:5000 except yourself.
        for (let key in allUsers) {
            if (allUsers.hasOwnProperty(key)) {
                if (key === data["friend_id"]) {
                    console.log("User socket connected. Send data to him.");
                    serverSocket.to(allUsers[key]["socket"].id).emit("received", data);
                    break;
                }
            }
        }
        console.log();
        //save chat to the database
    });

    socket.on("change friend", async function (data) {
        console.log("\nUser: " + data["user_id"] + " changed his friend stream to: " + data["friend_id"]);
        //broadcast message to everyone in port:5000 except yourself.
        for (let key in allUsers) {
            if (allUsers.hasOwnProperty(key)) {
                if (key === data["user_id"]) {
                    allUsers[key]["friend_id"] = data["friend_id"];

                    let messages = await chatDatabase.getMessages(key, allUsers[key]["friend_id"])
                    console.log("Extracted messages from the database. Trying to send an approvement");
                    serverSocket.to(socket.id).emit("change friend approved", messages);
                    break;
                }
            }
        }

        //save chat to the database
    });
    socket.on('disconnect',function () {
        for (let key in allUsers) {
            if (allUsers.hasOwnProperty(key)) {
                if (allUsers[key]["socket"].id === socket.id) {
                    auth.updateUserStatus(key, "offline").then(() => console.log("Update status offline succesfully"));
                    console.log('Got disconnect! : ' + socket.id);
                    console.log('User id! : ' + key + "\n");
                    delete allUsers[key];
                }
            }
        }
        //const i = allUsers.indexOf(socket);
        //allUsers.splice(i, 1);
    });
});


http.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:2014`);
    console.log(`Login http://localhost:2014/login`);
    console.log(`Register http://localhost:2014/register`);
    console.log(`Discover http://localhost:2014/discover`);
    console.log(`Chat http://localhost:2014/chat`);
});