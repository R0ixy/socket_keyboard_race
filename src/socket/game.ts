import {Server} from "socket.io";
import {rooms} from "../roomsData";

const getCurrentRoom = socket => [...socket.rooms.keys()].find(roomId => rooms.has(roomId)) as string;


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('user-join', (roomName: string, username: string) => {
            socket.join(roomName);

            rooms.get(roomName)?.push({username: username, ready: false});
            const users = rooms.get(roomName);

            socket.broadcast.emit('users-number-update', roomName, users?.length);
            socket.emit('users-list', users);
            socket.to(roomName).emit('user-join-room', {username: username, ready: false});

        });

        socket.on('user-quit-room', (username) => userQuitRoom(io, socket, username));

        socket.on('disconnect', () => userQuitRoom(io, socket, socket.handshake.query.username as string));

    });
}

const userQuitRoom = (io, socket, username: string) => {
    const currentRoom = getCurrentRoom(socket);
    rooms.get(currentRoom)?.splice(rooms.get(currentRoom)?.findIndex(user => user.username === username) as number, 1);
    io.emit('users-number-update', currentRoom, rooms.get(currentRoom)?.length);
    socket.to(currentRoom).emit('user-quit-room-event', username);

    socket.leave(currentRoom);
}