import {Server} from "socket.io";
import {getCurrentRoom} from "./managePlayersInRooms";
import {rooms, Room} from "../roomsData";


export const winners: Set<string> = new Set;


export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('change-user-progress', (username: string, progress: number) => {
            const currentRoom: string = getCurrentRoom(socket);
            socket.to(currentRoom).emit('user-progress', username, progress);

            if (progress === 100) {
                winners.add(username);
                const room = rooms.get(currentRoom) as Room;
                if (winners.size === room?.users.length) {
                    io.to(currentRoom).emit('all-users-finished', [...winners]);
                    winners.clear();
                    room.users.forEach(user => user.ready = false);
                    room.started = false;
                    if (!room.full){
                        io.emit('add-room', currentRoom, room.users.length);
                    }

                }
            }
        });
    });
}