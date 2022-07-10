import {appendUserElement, removeUserElement} from "../views/user.mjs";

export const joinRoom = (roomName, socket, username) => {
    document.getElementById('rooms-page').classList.add('display-none');
    document.getElementById('game-page').classList.remove('display-none');


    socket.emit('user-join', roomName, username);
    // socket.on('users-list', room => {
    //     if (room.name === roomName) {
    //         room.users.map(user => {
    //             appendUserElement({
    //                 username: user.username,
    //                 ready: user.ready,
    //                 isCurrentUser: user.username === username,
    //             });
    //         });
    //     }
    // });

    // socket.on('user-join-room', (roomNameFromServer, user) => {
    //     // if (roomNameFromServer === roomName) {
    //     appendUserElement({
    //         username: user.username,
    //         ready: user.ready,
    //         isCurrentUser: user.username === username,
    //     });
    //     // }
    // });

    socket.on('user-quit-room-event', username => {
        // if (roomNameFromServer === roomName) {
        removeUserElement(username);
        // }
    });

    // const quitButton = document.getElementById('quit-room-btn');
    // document.getElementById('quit-room-btn').addEventListener('click', () => {
    //     onQuitRoom(roomName, socket, username);
    //     document.getElementById('quit-room-btn').removeEventListener('click', onQuitRoom);
    // });

    // gamePageHandlers(roomName, socket, username);
}

// const gamePageHandlers = (roomName, socket, username) => {
//     const quitButton = document.getElementById('quit-room-btn');
//     quitButton.addEventListener('click', () => {
//         onQuitRoom(roomName, socket, username);
//     });
//     quitButton.removeEventListener('click', () => {onQuitRoom(roomName, socket, username)});
//
//     // document.getElementById('ready-btn').addEventListener('click', () => {
//     //     socket.emit('user-ready');
//     // });
// }

export const onQuitRoom = (socket, username) => {
    const users = document.querySelectorAll('.user');
    users.forEach(box => {
        box.remove();
    });
    socket.emit('user-quit-room', username);
    document.getElementById('rooms-page').classList.remove('display-none');
    document.getElementById('game-page').classList.add('display-none');
}