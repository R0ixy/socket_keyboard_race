import {Server} from "socket.io";
import {getCurrentRoom} from "./managePlayersInRooms";
import {rooms, Room, User} from "../roomsData";


export const winners: Set<string> = new Set;


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('change-user-progress', (username: string, progress: number) => {
            const currentRoom: string = getCurrentRoom(socket);
            const room = rooms.get(currentRoom) as Room;
            room.users.filter(user => user.username === username)[0].progress = progress;

            socket.to(currentRoom).emit('user-progress', username, progress);

            if (progress === 100) {
                winners.add(username);
                if (winners.size === room?.users.length) {
                    io.to(currentRoom).emit('game-over', [...winners]);
                    gameOver(io, currentRoom, room);
                }
            }
        });
        socket.on('time-is-up', () => {
            const currentRoom: string = getCurrentRoom(socket);
            const room = rooms.get(currentRoom) as Room;
            const users = room.users.filter(user => !winners.has(user.username)).sort((user1: User, user2: User) => user2.progress - user1.progress);
            io.to(currentRoom).emit('game-over', [...winners, ...users.map(user => user.username)]);
            gameOver(io, currentRoom, room);
        });
    });
}

export const gameOver = (io, currentRoom, room) => {
    winners.clear();
    room.users.forEach(user => user.ready = false);
    room.started = false;
    if (!room.full) {
        io.emit('add-room', currentRoom, room.users.length);
    }
}