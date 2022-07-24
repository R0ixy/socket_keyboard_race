import {Server} from "socket.io";

export class MessageEmitter {
    private io: Server;
    private currentRoom: string;
    public sendMessage: Function;
    public sendGameOver: Function;

    constructor(io: Server, currentRoom: string) {
        this.io = io;
        this.currentRoom = currentRoom;
        this.sendMessage = this.emitterCurry('new-message');
        this.sendGameOver = this.emitterCurry('game-over');
    }

    private emitterCurry(type) {
        return (message) => {
            this.io.to(this.currentRoom).emit(type, message);
        }
    }

}