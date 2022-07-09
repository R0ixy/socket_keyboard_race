import {showInputModal} from "../views/modal.mjs";
import {appendRoomElement, updateNumberOfUsersInRoom} from "../views/room.mjs";

export const addNewRoom = (socket, username) => {
    let roomName = '';
    document.getElementById('add-room-btn').addEventListener('click', () => {
        showInputModal({
            'title': 'Create Room',
            onChange: name => roomName = name,
            onSubmit: () => {
                appendRoomElement({
                    name: roomName, numberOfUsers: 0,
                    onJoin: () => joinRoom(roomName, socket, username)
                });
                socket.emit('create-room', {name:roomName, numberOfUsers: 0, users: []});
            }
        });

    });
}
export const joinRoom = (roomName, socket, username) => {
    socket.emit('user-join', roomName, username)

}

const numberOfUsers = () => {

}