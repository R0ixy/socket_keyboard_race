import {Server} from "socket.io";
import {getCurrentRoom} from "./managePlayersInRooms";

export default (io: Server) => {
    io.on('connection', socket => {
        socket.on('change-user-progress', (username: string, progress: number) => {
            socket.to(getCurrentRoom(socket)).emit('user-progress', username, progress);
        });

    });
}