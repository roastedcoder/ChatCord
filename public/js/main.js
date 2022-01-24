


const charForm = document.getElementById('chat-form');
const socket = io(); // bcoz of script tag in chat.html
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveBTN = document.getElementById('leave-btn');

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
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

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
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}