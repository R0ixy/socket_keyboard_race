import {Server} from "socket.io";
import {rooms, User} from "../roomsData";
import * as config from './config';
import {texts} from "../data";
import {SECONDS_TIMER_BEFORE_START_GAME} from "./config";

export const getCurrentRoom = socket => [...socket.rooms.keys()].find(roomId => rooms.has(roomId)) as string;


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('user-join', (roomName: string, username: string) => {
            if (rooms.get(roomName)?.length as number + 1 <= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
                socket.join(roomName);

                rooms.get(roomName)?.push({username: username, ready: false});
                const users = rooms.get(roomName) as User[];

                socket.broadcast.emit('users-number-update', roomName, users?.length);
                socket.emit('users-list', users);
                socket.to(roomName).emit('user-join-room', {username: username, ready: false});
            } else {
                socket.emit('room-full', roomName);
            }
        });

        socket.on('user-quit-room', (username) => userQuitRoom(io, socket, username));

        socket.on('disconnecting', () => userQuitRoom(io, socket, socket.handshake.query.username as string));
    });
}

const userQuitRoom = (io, socket, username: string) => {
    const currentRoom = getCurrentRoom(socket);
    if (currentRoom) {
        const users = rooms.get(currentRoom) as User[];

        users?.splice(rooms.get(currentRoom)?.findIndex(user => user.username === username) as number, 1);
        if (rooms.get(currentRoom)?.length === 0) {
            rooms.delete(currentRoom);
            io.emit('delete-room', currentRoom);
        } else {
            io.emit('users-number-update', currentRoom, rooms.get(currentRoom)?.length);
            socket.to(currentRoom).emit('user-quit-room-event', username);
        }

        if (users.every(user => user.ready)) {
            const textId: number = Math.floor(Math.random() * texts.length)
            io.to(currentRoom).emit('all-users-ready', SECONDS_TIMER_BEFORE_START_GAME, textId);
        }

        socket.leave(currentRoom);
    }
}