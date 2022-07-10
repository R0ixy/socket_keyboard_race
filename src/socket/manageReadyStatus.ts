import {Server} from "socket.io";
import {rooms, User} from "../roomsData";
import {getCurrentRoom} from "./managePlayersInRooms";
import {SECONDS_TIMER_BEFORE_START_GAME} from "./config";
import {texts} from "../data";


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('user-ready', (username: string) => {
            const currentRoom = getCurrentRoom(socket);
            const users = rooms.get(currentRoom) as User[];
            const user = users?.find(user => user.username === username) as User;
            if (user) {
                user.ready = true;
                socket.to(currentRoom).emit('user-ready', username);

                if (users.every(user => user.ready)) {
                    const textId: number = Math.floor(Math.random() * texts.length)
                    io.to(currentRoom).emit('all-users-ready', SECONDS_TIMER_BEFORE_START_GAME, textId);
                }
            }
        });

        socket.on('user-not-ready', (username: string) => {
            const room = getCurrentRoom(socket);
            const users = rooms.get(room);
            const user = users?.find(user => user.username === username);
            if (user) {
                user.ready = false;
                socket.to(room).emit('user-not-ready', username);
            }
        });
    });
}

