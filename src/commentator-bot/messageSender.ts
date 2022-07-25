import {MessageService} from "./messageService";
import {User} from "../roomsData";
import {Server} from "socket.io";
import {MessageEmitter} from "./messageEmitter";
import {ChooseService} from "./serviceFactory";
import {SECONDS_TIMER_BEFORE_START_GAME} from "../socket/config";


export interface AbstractSender {
    startRace(): void;

    beforeFinish(): void;

    userFinishesRace(winnerName: string, winnersCount: number): void;

    gameOver(winnersNames: string[]): void;
}


export class MessageSender implements AbstractSender { // Facade pattern

    private messageService: MessageService;
    private messageEmitter: MessageEmitter;

    private interval?: NodeJS.Timer;
    private randomMessageInterval?: NodeJS.Timer;
    private isBeforeFinishSend: boolean;
    private timer: number;
    private readonly timeArr: number[]

    constructor(players: User[], io: Server, currentRoom: string) {
        this.messageEmitter = new MessageEmitter(io, currentRoom);
        this.messageService = ChooseService.factoryMethod(players);
        this.isBeforeFinishSend = false;
        this.timer = 0
        this.timeArr = []
    }


    public startRace(): void {
        this.messageEmitter.sendMessage(this.messageService.greetMessage());


        setTimeout(() => {
            this.messageEmitter.sendMessage(this.messageService.startMessage());
        }, 5000);


        setTimeout(() => {
            this.timer = new Date().getTime();
            this.interval = setInterval(() => {
                this.messageEmitter.sendMessage(this.messageService.progressMessage());
            }, 30000);
            this.randomMessage();
        }, SECONDS_TIMER_BEFORE_START_GAME);

    }

    public beforeFinish(): void {
        if (!this.isBeforeFinishSend) {
            this.isBeforeFinishSend = true;
            this.messageEmitter.sendMessage(this.messageService.beforeFinishMessage());
        }
    }

    public userFinishesRace(username: string, number: number): void {
        this.timeArr.push(new Date().getTime() - this.timer);
        this.messageEmitter.sendMessage(this.messageService.finishMessage(username, number));
    }

    public gameOver(winners: string[]): void {
        clearInterval(this.interval as NodeJS.Timer);
        clearInterval(this.randomMessageInterval as NodeJS.Timer);
        this.messageEmitter.sendGameOver(this.messageService.winnersMessage(winners, this.timeArr));
    }

    private randomMessage(): void {
        this.randomMessageInterval = setInterval(() => {
            this.messageEmitter.sendMessage(this.messageService.randomCommentMessage());
        }, 12000);
    }
}
