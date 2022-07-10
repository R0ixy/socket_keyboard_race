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
                rooms.set(newRoomName, {started: false, full: false, users: []});
                io.emit('add-room', newRoomName, 0);
            }
        });

        socket.on('get-rooms', () => {
            const roomArr: roomArr[] = [];
            rooms.forEach((room, roomName) => {
                    if (!room.started && !room.full) {
                        roomArr.push({name: roomName, usersNumber: room.users.length});
                    }
                }
            );
            socket.emit('existing-rooms', roomArr);
        });
    });
}
