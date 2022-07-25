import {AbstractSender, MessageSender} from "./messageSender";
import {SECONDS_TIMER_BEFORE_START_GAME} from "../socket/config";


export class LoggerProxy implements AbstractSender { // Proxy pattern
    private realSubject: MessageSender;
    private readonly infoLogger: Function;
    private timer: number;
    private beforeFinishSend: boolean;

    constructor(realSubject: MessageSender) {
        this.realSubject = realSubject;
        this.infoLogger = this.logger('info');
        this.timer = 0
        this.beforeFinishSend = false;
    }

    startRace(){
        this.realSubject.startRace();
        this.infoLogger('countdown started');
        setTimeout(() => {
            this.infoLogger('race started');
            this.timer = new Date().getTime()
        }, SECONDS_TIMER_BEFORE_START_GAME);
    };

    beforeFinish(){
        this.realSubject.beforeFinish();
        if(!this.beforeFinishSend) {
            this.infoLogger('30 letters left');
            this.beforeFinishSend = true;
        }
    };

    userFinishesRace(winnerName: string, winnersCount: number){
        this.realSubject.userFinishesRace(winnerName, winnersCount);
        this.infoLogger(`${winnerName} finished`);
    };

    gameOver(winnersNames: string[]){
        this.realSubject.gameOver(winnersNames);
        this.infoLogger(`race is over. Duration: ${new Date().getTime() - this.timer}ms. Leaderboard: ${winnersNames.join(', ')}`);
    };


    logger(importance) {
        return (message) => {
            const date = new Date();
            console.log(`[${date.toLocaleString('ua')}][${importance}] ${message}`);
        }
    }

}
