import {showMessageModal} from "./views/modal.mjs";
import {addNewRoom, joinRoom} from "./handlers/newRoom.mjs";
import {appendRoomElement, updateNumberOfUsersInRoom} from "./views/room.mjs";


const username = sessionStorage.getItem('username');

if (!username) {
    window.location.replace('/login');
}

const socket = io('', {query: {username}});

socket.on('username-taken', () => {
    sessionStorage.removeItem('username');
    showMessageModal({
        message: `Username ${username} is already taken!`,
        onClose: () => window.location.replace('/login')
    });
})


socket.emit('get-rooms');

socket.on('rooms', rooms => {
    rooms.forEach(room => {
        appendRoomElement(
            {
                name: room.name, numberOfUsers: room.users.length,
                onJoin: () => joinRoom(room.name, socket, username)
            });
    });
});

socket.on('new-room', room => {
    appendRoomElement(
        {
            name: room.name, numberOfUsers: room.users.length,
            onJoin: () => joinRoom(room.name, socket, username)
        });
});

socket.on('users-number-update', room => {
    updateNumberOfUsersInRoom({name: room.name, numberOfUsers: room.users.length});
})

addNewRoom(socket, username);

// socket