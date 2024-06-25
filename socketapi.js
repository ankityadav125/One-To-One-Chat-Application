const io = require("socket.io")();
const socketapi = {
    io: io
};
const messageModel = require('./models/message')

const userModel = require('./models/user')

// Add your socket.io logic here!
io.on("connection", function (socket) {


    socket.on('join', async username => {
        await userModel.findOneAndUpdate({
            username
        }, {
            socketId: socket.id
        })
    })
    socket.on('disconnect', async () => {

        await userModel.findOneAndUpdate({
            socketId: socket.id
        }, {
            socketId: ""
        })

    })

    socket.on('sony', async messageObject => {

        await messageModel.create({
            receiver: messageObject.receiver,
            sender: messageObject.sender,
            text: messageObject.text
        })

        const sender = await userModel.findOne({
            username: messageObject.sender
        })
        const receiver = await userModel.findOne({
            username: messageObject.receiver
        })

        const messagePacket = {
            sender: sender,
            receiver: receiver,
            text: messageObject.text
        }

        socket.to(receiver.socketId).emit('max', messagePacket)


    })


});
// end of socket.io logic

module.exports = socketapi;