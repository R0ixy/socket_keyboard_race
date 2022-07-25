import {Server} from "socket.io";
import {getCurrentRoom} from "./managePlayersInRooms";
import {rooms, Room, User} from "../roomsData";


export const winners: Set<string> = new Set;


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('change-user-progress', (username: string, progress: number, lettersLeft: number) => {
            const currentRoom: string = getCurrentRoom(socket);
            const room = rooms.get(currentRoom) as Room;
            room.users.filter(user => user.username === username)[0].progress = progress;

            socket.to(currentRoom).emit('user-progress', username, progress);

            if (lettersLeft == 30) {
                room.messageSender?.beforeFinish();
            }

            if (progress === 100) {
                winners.add(username);
                room.messageSender?.finishRace(username, winners.size);
                if (winners.size === room?.users.length) {
                    gameOver(io, currentRoom, room, [...winners]);
                }
            }
        });
        socket.on('time-is-up', () => {
            const currentRoom: string = getCurrentRoom(socket);
            const room = rooms.get(currentRoom) as Room;
            const users = room?.users.filter(user => !winners.has(user.username)).sort((user1: User, user2: User) => user2.progress - user1.progress);
            gameOver(io, currentRoom, room, [...winners, ...users.map(user => user.username)]);
        });
    });
}

export const gameOver = (io, currentRoom, room, winnersNames: string[]) => {
    winners.clear();
    room.users.forEach(user => user.ready = false);
    room.started = false;
    if (!room.full) {
        io.emit('add-room', currentRoom, room.users.length);
    }
    room.messageSender?.gameOver(winnersNames);
}