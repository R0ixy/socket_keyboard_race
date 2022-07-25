import {MessageService} from "./messageService";
import {User} from "../roomsData";
import {Server} from "socket.io";
import {MessageEmitter} from "./messageEmitter";
import {ChooseService} from "./serviceFactory";


export interface AbstractSender {
    startRace(): void;

    beforeFinish(): void;

    finishRace(winnerName: string, winnersCount: number): void;

    gameOver(winnersNames: string[]): void;
}


export class MessageSender implements AbstractSender { // Facade pattern

    private messageService: MessageService;
    private messageEmitter: MessageEmitter;

    private interval?: NodeJS.Timer;
    private randomMessageInterval?: NodeJS.Timer;
    private isBeforeFinishSend: boolean;

    constructor(players: User[], io: Server, currentRoom: string) {
        this.messageEmitter = new MessageEmitter(io, currentRoom);
        this.messageService = ChooseService.factoryMethod(players);
        this.isBeforeFinishSend = false;
    }


    public startRace(): void {
        this.messageEmitter.sendMessage(this.messageService.greetMessage());


        setTimeout(() => {
            this.messageEmitter.sendMessage(this.messageService.startMessage());
        }, 5000);


        setTimeout(() => {
            this.interval = setInterval(() => {
                this.messageEmitter.sendMessage(this.messageService.progressMessage());
            }, 30000);
            this.randomMessage();
        }, 10000);

    }

    public beforeFinish(): void {
        if (!this.isBeforeFinishSend) {
            this.isBeforeFinishSend = true;
            this.messageEmitter.sendMessage(this.messageService.beforeFinishMessage());
        }
    }

    public finishRace(username: string, number: number): void {
        this.messageEmitter.sendMessage(this.messageService.finishMessage(username, number));
    }

    public gameOver(winners: string[]): void {
        clearInterval(this.interval as NodeJS.Timer);
        clearInterval(this.randomMessageInterval as NodeJS.Timer);
        this.messageEmitter.sendGameOver(this.messageService.winnersMessage(winners));
    }

    private randomMessage(): void {
        this.randomMessageInterval = setInterval(() => {
            this.messageEmitter.sendMessage(this.messageService.randomCommentMessage());
        }, 12000);
    }
}
