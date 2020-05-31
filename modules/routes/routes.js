const dbSchema = require('../database/dbSchema.js');
const auth = require('../database/auth.js');
const validation = require('../validation/validation.js');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const utilities = require('../utilities');
let countries;

(async function () {
    countries = await utilities.readFileAsync("public/data/country.json");
})();

module.exports = {
    index: async function (req, res) {
        //console.log('cookies: ', req.cookies);
        let error = req.cookies["error"];
        res.clearCookie("error");
        let posts = await auth.getUserPostsById(req.session.user._id);
        posts.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
        });

        if (posts){
            req.session.user.posts = posts;
        }
        res.render('index', {user: req.session.user, enable_index_css: true, error: error, moment: moment});
    },
    indexPost: async function (req, res) {
        let newPost = new dbSchema.Post({
            message: req.body["post-textarea"],
            owner: req.body["user_id"],
            date: moment()
        })
        console.log("Postare Primita de la userul " + req.body["user_id"]);
        try{
            await auth.insertPostMessage(newPost);
            res.sendStatus(200);
        } catch(exception){
            res.sendStatus(400);
        }
    },

    registerGet: function (req, res) {
        let error = req.cookies["error"];
        res.clearCookie("error");
        res.render('register', {countries: countries, error: error});
    },

    registerPost: async function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let passwordConfirmation = req.body.passwordConfirmation;
        let email = req.body.email;
        let birthDay = req.body.birthday;
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let gender = req.body.gender;
        let city = req.body.city;
        let country = req.body.country;

        if (!validation.validateEmail(email) || !validation.validateName(firstName) || !validation.validateName(lastName) || !validation.validateUsername(username)) {
            res.cookie("error", {status: true, message: "Invalid data"});
            res.sendStatus(400);
            return;
        }
        if (password !== passwordConfirmation) {
            res.cookie("error", {status: true, message: "Passwords don't match"});
            res.sendStatus(400);
            return;
        }
        let user = await auth.getUser(username);
        if (user != null) {
            res.cookie("error", {status: true, message: "Username already exists"});
            res.sendStatus(400);
            return;
        }
        let imagePath;
        if (gender === "male"){
            imagePath = "images/male.png";
        } else if (gender === "female"){
            imagePath = "images/female.jpg";
        }
        let new_user = new dbSchema.User({
            username: username,
            password: password,
            email: email,
            birthDay: birthDay,
            firstName: firstName,
            lastName: lastName,
            role: "user",
            gender: gender,
            city: city,
            country: country,
            status: "offline",
            profileImagePath: imagePath,
        });
        await auth.insertUser(new_user);
        res.sendStatus(200);
    },

    inbox: function (req, res) {
        res.render('chat', {enable_chat_css: true, socket_enable: true});
    },

    loginGet: function (req, res) {
        let error = req.cookies["error"];
        res.clearCookie("error");
        if (req.session.user) {   //if logged
            res.redirect("/");
            return;
        }
        res.render("login", {error: error});
    },
    loginPost: async function (req, res) {
        if (!validation.validateUsername(req.body.username)) {
            res.cookie("error", {status: true, message: "Invalid username"});
            res.sendStatus(400);
            return;
        }
        //console.log("Parola hash primita:" + req.body.password);
        let user = await auth.getUser(req.body.username, req.body.password);
        if (user == null) {
            res.cookie("error", {status: true, message: "Incorrect data"});
            res.sendStatus(400);
            return;
        }
        delete user.password;
        user["age"] = utilities.calculateAge(user.birthDay);
        req.session.user = user;
        res.sendStatus(200);
    },
    logout: function (req, res) {
        if (req.session.user) {   //if logged
            console.log("Sesiune utilizator [Log-OUT]: ", req.session.user);
            req.session.user = undefined;
        }
        res.redirect("/login");
    },
}