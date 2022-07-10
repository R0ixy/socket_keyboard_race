import {Server} from "socket.io";
import {rooms, User, Room} from "../roomsData";
import {getCurrentRoom} from "./managePlayersInRooms";
import {SECONDS_TIMER_BEFORE_START_GAME} from "./config";
import {texts} from "../data";


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('user-ready', (username: string) => {
            const currentRoom = getCurrentRoom(socket);
            const room = rooms.get(currentRoom) as Room;
            const user = room.users.find(user => user.username === username) as User;
            if (user) {
                user.ready = true;
                socket.to(currentRoom).emit('user-ready', username);

                if (room.users.every(user => user.ready)) {
                    onGameStart(io, currentRoom, room);
                }
            }
        });

        socket.on('user-not-ready', (username: string) => {
            const room: string = getCurrentRoom(socket);
            const users = rooms.get(room)?.users as User[];
            const user: User | undefined = users?.find(user => user.username === username);
            if (user) {
                user.ready = false;
                socket.to(room).emit('user-not-ready', username);
            }
        });
    });
}


export const onGameStart = (io, currentRoom, room) => {
    const textId: number = Math.floor(Math.random() * texts.length)
    io.to(currentRoom).emit('all-users-ready', SECONDS_TIMER_BEFORE_START_GAME, textId);
    room.started = true;
    io.emit('delete-room', currentRoom);
}

