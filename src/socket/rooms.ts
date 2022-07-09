import {Server} from 'socket.io';

const rooms: Room[] = [];

interface Room {
    name: string;
    numberOfUsers: number;
    users: string[];
}


export default (io: Server) => {
    io.on("connection", socket => {
        socket.on('create-room', (room: Room) => {
            rooms.push(room);
            socket.broadcast.emit('new-room', room);
        });

        socket.on('get-rooms', () => {
            socket.emit('rooms', rooms);
        });

        socket.on('user-join', (roomName: string, user: string) => {
            rooms.filter(room => room.name === roomName)[0].users.push(user);

            socket.emit('users-number-update', rooms.filter(room => room.name === roomName)[0]);
            socket.broadcast.emit('users-number-update', rooms.filter(room => room.name === roomName)[0]);
        });
    });
}
