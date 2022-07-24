import {MessageService} from "./messageService";
import {User} from "../roomsData";
import {Server} from "socket.io";
import {MessageEmitter} from "./messageEmitter";


export class MessagesSender { // Facade pattern

    private messageService: MessageService;
    private messageEmitter: MessageEmitter;

    private interval?: NodeJS.Timer;

    constructor(players: User[], io: Server, currentRoom: string, messageService: MessageService) {
        this.messageEmitter = new MessageEmitter(io, currentRoom);
        this.messageService = new MessageService(players);
        console.log('MessagesSender constructor');
    }


    public startRace() {
        this.messageEmitter.sendMessage(this.messageService.greedMessage());

        console.log('startRace');

        setTimeout(() => {
            this.messageEmitter.sendMessage(this.messageService.startMessage());
        }, 5000);


        setTimeout(() => {
            this.interval = setInterval(() => {
                this.messageEmitter.sendMessage(this.messageService.progressMessage());
                console.log('interval');
            }, 15000);
        }, 10000);

    }

    public finishRace(username: string, number: number) {
        this.messageEmitter.sendMessage(this.messageService.finishMessage(username, number));
    }

    public gameOver(winners: string[]) {
        clearInterval(this.interval as NodeJS.Timer);
        this.messageEmitter.sendGameOver(this.messageService.winnersMessage(winners));
        console.log('stopRace');
    }
}
