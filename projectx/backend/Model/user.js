const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    refreshToken: String,
})

module.exports = mongoose.model("User", userSchema);