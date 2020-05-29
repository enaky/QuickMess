const dbSchema = require('./../database/dbSchema.js');
const auth = require('./../database/auth.js');

function validateEmail(email)
{
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validateUsername(email)
{
    return /^[a-zA-Z0-9_.]+$/.test(email);
}

function validateName(email)
{
    return /^[a-zA-Z\-]+$/.test(email);
}

module.exports = {
    index: async function(req, res){
        //console.log('cookies: ', req.cookies);
        let username = null;
        if (req.session.user) {
            username = req.session.user.firstname;
        }
        res.render('index', {user: username});
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

        if (!validateEmail(email) || !validateName(firstName) || !validateName(lastName) || !validateUsername(username)){
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
        res.render('inbox', {css_file: "chat.css"});
    },

    login: function(req, res){
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
    }
}