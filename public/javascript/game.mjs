import {showInputModal, showMessageModal} from "./views/modal.mjs";
import {joinRoom, onQuitRoom} from "./handlers/joinRoom.mjs";
import {appendRoomElement, removeRoomElement, updateNumberOfUsersInRoom} from "./views/room.mjs";
import {appendUserElement, removeUserElement} from "./views/user.mjs";
import {addClass, removeClass} from "./helpers/domHelper.mjs";


const username = sessionStorage.getItem('username');

if (!username) {
    window.location.replace('/login');
}

export const socket = io('', {query: {username}});

socket.on('username-taken', () => {
    sessionStorage.removeItem('username');
    showMessageModal({
        message: `Username ${username} is already taken!`,
        onClose: () => window.location.replace('/login')
    });
});


socket.emit('get-rooms');

socket.on('existing-rooms', rooms => {
    rooms.forEach(room => {
        appendRoomElement(
            {
                name: room.name, numberOfUsers: room.usersNumber,
                onJoin: () => joinRoom(room.name, socket, username)
            });
    });
});


socket.on('room-name-taken', roomName => {
    showMessageModal({
        message: `Room name "${roomName}" is already taken!`
    });
});

socket.on('users-number-update', (roomName, roomLength) => {
    updateNumberOfUsersInRoom({name: roomName, numberOfUsers: roomLength});
});


document.getElementById('add-room-btn').addEventListener('click', () => {
    let roomName = '';
    showInputModal({
        'title': 'Create Room',
        onChange: name => roomName = name,
        onSubmit: () => {
            socket.emit('create-room', roomName);
        }
    });
});

socket.on('room-created', roomName => {
    joinRoom(roomName, socket, username)
});

socket.on('add-room', (roomName, usersNumber) => {
    appendRoomElement(
        {
            name: roomName,
            numberOfUsers: usersNumber,
            onJoin: () => joinRoom(roomName, socket, username)
        }
    );
});

socket.on('show-room', (users, roomName) => {
    addClass(document.getElementById('rooms-page'), 'display-none');
    removeClass(document.getElementById('game-page'), 'display-none');
    document.getElementById('room-name').innerText = roomName;
    document.getElementById('ready-btn').innerText = 'READY';
    users.map(user => {
        appendUserElement({
            username: user.username,
            ready: user.ready,
            isCurrentUser: user.username === username,
        });
    });
});


document.getElementById('quit-room-btn').addEventListener('click', () => {
    onQuitRoom(socket, username);
});

socket.on('user-quit-room-event', username => {
    removeUserElement(username);
});

socket.on('user-join-room', user => {
    appendUserElement({
        username: user.username,
        ready: user.ready,
        isCurrentUser: user.username === username,
    });
});

socket.on('room-full', roomName => {
    showMessageModal({
        message: `Room ${roomName} is full!`
    });
});

socket.on('delete-room', roomName => {
    removeRoomElement(roomName);
});
