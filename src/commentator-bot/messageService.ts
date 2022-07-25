import {User} from "../roomsData";
import {cars, fillers} from "./bot-data";

interface AbstractService {
    greetMessage(): string;

    startMessage(): string;

    progressMessage(): string;

    finishMessage(username: string, number: number): string;

    winnersMessage(winners: string[]): string;

    randomCommentMessage(): string;
}


export abstract class MessageService implements AbstractService {
    private _players: User[];

    constructor(players) {
        this._players = players;
    }

    public abstract greetMessage(): string ;

    public startMessage(): string {
        return `И вот наши сегодняшние претенденты: ${this._players.map(user => `${user.username} на ${cars[Math.floor(Math.random() * cars.length)]}`).join(', ')}`;
    }

    public progressMessage(): string {
        const sorted = [...this._players].sort((user1, user2) => {
            return user2.progress - user1.progress;
        });
        return `Cписок гонщиков по прогрессу: ${sorted.map((user, index) => `${user.username} - ${index + 1}`).join(', ')}`;
    }

    public beforeFinishMessage(): string {
        const sorted = [...this._players].sort((user1, user2) => {
            return user2.progress - user1.progress;
        });
        return `До финиша осталось совсем немного и похоже что первым его может пересечь ${sorted[0].username}. ` + (sorted[1] ?
            `Второе место может достаться ${sorted[1].username} ` : '') + (sorted[2] ?
            ` или ${sorted[2].username}. ` : '') + `Но давайте дождемся окончания этого состязания.`;
    }

    public finishMessage(username: string, number: number): string {
        switch (number) {
            case 1:
                return 'НЕВЕРОЯТНО! У нас есть победитель и это ' + username + '!';
            case 2:
                return 'Вторым финишную черту пересекает ' + username + ' - отличный результат!';
            case 3:
                return 'Третьим к финишу приходит ' + username + ', поздравляем!';
            default:
                return number + 'м - приходит ' + username;
        }
    }

    public winnersMessage(winners: string[]): string {
        return `Заезд завершается, поздравляем победителей!\n ${winners.map((winner, index) => `${index + 1}е место - ${winner}`).join('\n')}`;
    }

    public randomCommentMessage(): string {
        return fillers[Math.floor(Math.random() * fillers.length)];
    }
}