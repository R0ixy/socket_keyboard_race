import {Server} from "socket.io";
import {rooms, User, Room} from "../roomsData";
import {MAXIMUM_USERS_FOR_ONE_ROOM} from './config';
import {gameOver, winners} from "./manageGame";
import {onGameStart} from "./manageReadyStatus";

export const getCurrentRoom = socket => [...socket.rooms.keys()].find(roomId => rooms.has(roomId)) as string;


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('user-join', (roomName: string, username: string) => {
            const room = rooms.get(roomName) as Room;
            if (room?.users.length as number + 1 <= MAXIMUM_USERS_FOR_ONE_ROOM) {
                socket.join(roomName);

                rooms.get(roomName)?.users.push({username: username, ready: false, progress: 0});
                const users = rooms.get(roomName)?.users as User[];

                socket.broadcast.emit('users-number-update', roomName, users?.length);
                socket.emit('show-room', users, roomName);
                socket.to(roomName).emit('user-join-room', {username: username, ready: false});

                if (room.users.length === MAXIMUM_USERS_FOR_ONE_ROOM){
                    room.full = true;
                    io.emit('delete-room', roomName);
                }

            } else {
                socket.emit('room-full', roomName);
            }
        });

        socket.on('user-quit-room', (username: string) => userQuitRoom(io, socket, username));

        socket.on('disconnecting', () => userQuitRoom(io, socket, socket.handshake.query.username as string));
    });
}

const userQuitRoom = (io, socket, username: string) => {
    const currentRoom: string = getCurrentRoom(socket);
    if (currentRoom) {
        const room = rooms.get(currentRoom) as Room;
        const users = room.users as User[];

        users.splice(rooms.get(currentRoom)?.users.findIndex(user => user.username === username) as number, 1);
        if (rooms.get(currentRoom)?.users.length === 0) {
            rooms.delete(currentRoom);
            io.emit('delete-room', currentRoom);
        } else {
            io.emit('users-number-update', currentRoom, rooms.get(currentRoom)?.users.length);
            socket.to(currentRoom).emit('user-quit-room-event', username);
        }

        if (users.every(user => user.ready) && users.length >= 2 && !room.started) {
            onGameStart(io, currentRoom, room);
        }

        if (room.full && !room.started){
            room.full = false;
            io.emit('add-room', currentRoom, room.users.length);
        }

        if (room.started) {
            winners.delete(socket.handshake.query.username as string);
            if (winners.size === rooms.get(currentRoom)?.users.length) {
                io.to(currentRoom).emit('game-over', [...winners]);
                gameOver(io, currentRoom, room);
            }
        }

        socket.leave(currentRoom);
    }
}