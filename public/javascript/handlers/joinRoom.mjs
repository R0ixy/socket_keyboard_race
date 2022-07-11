import {addClass, removeClass} from "../helpers/domHelper.mjs";

export const joinRoom = (roomName, socket, username) => {
    socket.emit('user-join', roomName, username);
}

export const onQuitRoom = (socket, username) => {
    const users = document.querySelectorAll('.user');
    users.forEach(box => {
        box.remove();
    });
    socket.emit('user-quit-room', username);
    removeClass(document.getElementById('rooms-page'), 'display-none');
    addClass(document.getElementById('game-page'), 'display-none');
}