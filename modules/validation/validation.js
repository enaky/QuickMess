module.exports = {
    validateEmail: function (email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },

    validateUsername: function (email) {
        return /^[a-zA-Z0-9_.]+$/.test(email);
    },

    validateName: function (email) {
        return /^[ЁёА-яa-zA-Z\-ășțîâȘȚĂÎÂ]+$/.test(email);
    },
}