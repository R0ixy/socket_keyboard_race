import {Server} from 'socket.io';
import {rooms} from "../roomsData";

interface roomArr {
    name: string,
    usersNumber: number
}

export default (io: Server) => {
    io.on("connection", socket => {
        socket.on('create-room', (newRoomName: string) => {
            if (rooms.get(newRoomName)) {
                socket.emit('room-taken', newRoomName);
            } else {
                rooms.set(newRoomName, []);
                io.emit('new-room', newRoomName);
            }
        });

        socket.on('get-rooms', () => {
            const roomArr: roomArr[] = [];
            rooms.forEach((users, roomName) => {
                    roomArr.push({name: roomName, usersNumber: users.length})
                }
            );
            socket.emit('existing-rooms', roomArr);
        });
    });
}
