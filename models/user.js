const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profileImage: {
        type: String,
        default: "/images/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
    },
    socketId: String
})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);

