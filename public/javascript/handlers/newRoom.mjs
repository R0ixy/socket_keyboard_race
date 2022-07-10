// import {showInputModal} from "../views/modal.mjs";
// import {appendRoomElement} from "../views/room.mjs";
// import {joinRoom} from "./joinRoom.mjs";

// export const addNewRoom = (socket, username) => {
//     let roomName = '';
//     document.getElementById('add-room-btn').addEventListener('click', () => {
//         showInputModal({
//             'title': 'Create Room',
//             onChange: name => roomName = name,
//             onSubmit: () => {
//                 socket.emit('create-room', {name:roomName, numberOfUsers: 0, users: []});
//             }
//         });
//
//     });
//
//     socket.on('created-successfully', name => {
//         if(name === roomName) {
//             appendRoomElement({
//                 name: roomName, numberOfUsers: 0,
//                 onJoin: () => joinRoom(roomName, socket, username)
//             });
//         }
//     });
// }

// let roomName = '';
// document.getElementById('add-room-btn').addEventListener('click', () => {
//     showInputModal({
//         'title': 'Create Room',
//         onChange: name => roomName = name,
//         onSubmit: () => {
//             socket.emit('create-room', {name:roomName, numberOfUsers: 0, users: []});
//         }
//     });
//
// });
//
//
// socket.on('created-successfully', name => {
//     if(name === roomName) {
//         appendRoomElement({
//             name: roomName, numberOfUsers: 0,
//             onJoin: () => joinRoom(roomName, socket, username)
//         });
//     }
// });
// export const joinRoom = (roomName, socket, username) => {
//     onJoinRoom(roomName, socket, username);
// }
