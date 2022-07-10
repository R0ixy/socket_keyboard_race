import {Server} from 'socket.io';
import * as config from './config';
import rooms from './rooms';
import game from './game';

const users = new Set<string>();

export default (io: Server) => {
    io.on('connection', socket => {
        const username = socket.handshake.query.username as string;
        if (users.has(username)) {
            socket.emit('username-taken');
            socket.disconnect()
        } else {
            users.add(username);
        }
        socket.on('disconnect', () => {
            users.delete(username);
        });
    });
    rooms(io);
    game(io);
};
