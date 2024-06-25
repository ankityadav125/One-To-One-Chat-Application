const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    receiver: String,
    sender: String,
    text: String
})


module.exports = mongoose.model('message', messageSchema)