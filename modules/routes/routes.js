const dbSchema = require('../database/dbSchema.js');
const auth = require('../database/auth.js');
const validation = require('../validation/validation.js');
const CryptoJS = require('crypto-js');

module.exports = {
    index: async function(req, res){
        //console.log('cookies: ', req.cookies);

        let username = null;
        if (req.session.user) {
            username = req.session.user.firstname;
        }
        res.render('index', {user: username, enable_index_css: true});
    },

    registerGet: function(req, res){
        res.render('register');
    },

    registerPost: async function(req, res){
        let username = req.body.username;
        let password = req.body.password;
        let passwordConfirmation = req.body.passwordConfirmation;
        let email = req.body.email;
        let birthDay = req.body.birthday;
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let gender = req.body.gender;

        if (!validation.validateEmail(email) || !validation.validateName(firstName) || !validation.validateName(lastName) || !validation.validateUsername(username)){
            res.render("register", {error: {status: true, message: "Invalid data"}});
            return;
        }
        if (password !== passwordConfirmation){
            res.render("register", {error: {status: true, message: "Passwords don't match"}});
            return;
        }
        let user = await auth.getUser(username);
        if (user != null){
            res.render("register", {error: {status: true, message: "Username already exists"}});
            return;
        }
        let new_user = new dbSchema.User({ username: username, password: password, email: email,
            birthDay: birthDay, firstName: firstName, lastName: lastName, role: "user", gender: gender});
        await auth.insertUser(new_user);
        res.redirect('login');
    },

    inbox: function(req, res){
        res.render('chat', {enable_chat_css: true});
    },

    loginGet: function(req, res){
        if (req.session.user) {   //if logged
            res.redirect("/");
            return;
        }
        res.render("login");
    },
    loginPost: async function(req, res){
        if (!validation.validateUsername(req.body.username)){
            res.render("login", {error: {status: true, message: "Invalid username"}});
            return;
        }

        let user = await auth.getUser(req.body.username, req.body.password);
        console.log(user)
        if (user == null){
            res.render("login", {error: {status: true, message: "Incorrect data"}});
            return;
        }
        delete user.password;
        console.log(user)
        res.redirect("/");
    }
}