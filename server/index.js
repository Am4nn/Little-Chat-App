const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');
const http = require('http');
const server = http.createServer(app);

// parse json request body
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true
}));


const io = require('socket.io')(server, {
    cors: {
        origin: true
    }
});

let originalConversations = [];
let conversations = [];
let numClients = 0;
let hidden = false;

io.on('connection', socket => {
    const id = socket.handshake.query.id;
    console.log('connected ', id);

    socket.join('ggwp');
    socket.emit('first-connection', conversations);
    socket.on('send-message', (msg, user) => {
        conversations.push({ msg, user });
        originalConversations.push({ msg, user });
        socket.broadcast.emit('recieve-msg', msg, user);
    });


    numClients++;
    io.emit('count', numClients);

    socket.on('disconnect', () => {
        numClients--;
        io.emit('count', numClients);
    });

    socket.on('hide', () => {
        if (!hidden) {
            hidden = true;
            conversations = [];
            io.emit('first-connection', conversations);
        } else {
            hidden = false;
            conversations = originalConversations;
            io.emit('first-connection', conversations);
        }
    });

});


// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
// Set static folder
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
);


// set handle error


const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
})