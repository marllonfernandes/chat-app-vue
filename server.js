const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 4300

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

io.on('connection', (socket) => {

    socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})