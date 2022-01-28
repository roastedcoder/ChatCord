


const charForm = document.getElementById('chat-form');
const socket = io(); // bcoz of script tag in chat.html
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveBTN = document.getElementById('leave-btn');
const showType = document.getElementById('usertyping');
const messageBox = document.getElementById('msg');

// get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// join chatroom
console.log(username, room);
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server
socket.on('message', message => {
    if(message.joinFlag === 1) {
        showSnackBar(message);
    }
    else {
        outputMessage(message);
        // scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// user typing msg from server
socket.on('user_typing', msg => {
    showType.innerHTML = msg;
    if(msg !== '') {
        showType.className = "showtyping";
    }
    else {
        showType.className = showType.className.replace("showtyping", "");
    }
});

// user typing
var isTyping = false;
var isNotTyping;
document.getElementById('msg').onkeyup = () => {
    sendIsTypingToUser();
    if (isNotTyping != undefined) clearTimeout(isNotTyping);
    isNotTyping = setTimeout(sendIsNotTyping, 500);
};

function sendIsTypingToUser() {
    if(!isTyping){
        socket.emit('userTyping', username);
        isTyping = true;
    }
}
function sendIsNotTyping() {
    socket.emit('userTyping', null);
    isTyping = false;
}


// message submit
charForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;

    // emit message to server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// leave room BTN
leaveBTN.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chat?');
    if(leaveRoom) {
        window.location = '../index.html';
    }
});


// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
                     <p class="text"> ${message.text} </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// add roomname to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

function showSnackBar(message) {
    var snackbar = document.getElementById("snackbar");

    // Add the "show" class to DIV
    snackbar.className = "show";
    snackbar.innerHTML = message.text;

    // After 5 seconds, remove the show class from DIV
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}