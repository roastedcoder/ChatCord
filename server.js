


const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static("public"));

const admin = 'admin';
let userName = 'anonymous';

io.on('connection', socket => {
    console.log('new websocket connection...');

    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        userName = user.username;

        // welcome message
        socket.emit('message', formatMessage(admin, 'welcome home sir!'));

        // broadcast when a user connects
        socket.broadcast
                .to(user.room)
                .emit('message', formatMessage(admin, `${user.username} has joined the chat`));

        // send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });



    // listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
        // console.log(msg);
    });

    // runs when a client disconnects
    socket.on('disconnect', ()=> {  
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', 
                formatMessage(admin, `${user.username} has left the chat`)
            );
        
            // send user and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });
})





const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log('server live at ' + PORT));