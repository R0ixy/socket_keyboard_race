import {User} from "../roomsData";

interface AbstractService {
    greedMessage(): string;

    startMessage(): string;

    progressMessage(): string;

    finishMessage(username: string, number: number): string;

    winnersMessage(winners: string[]): string;
}


export class MessageService implements AbstractService {
    private _players: User[];

    constructor(players) {
        this._players = players;
    }

    public greedMessage(): string {
        return 'На улице сейчас немного пасмурно, но на Львов Арена сейчас просто замечательная атмосфера: двигатели рычат, зрители улыбаются а гонщики едва заметно нервничают и готовят своих железных коней к заезду. А комментировать всё это действо буду я, Эскейп Энтерович и я рад вас приветствовать со словами Доброго Вам дня, господа!'
    }

    public startMessage(): string {
        return `И вот наши сегодняшние претенденты: ${this._players.map(user => user.username).join(', ')}`;
    }

    public progressMessage(): string {
        const sorted = [...this._players].sort((user1, user2) => {
            return user2.progress - user1.progress;
        });
        return `А тем верменм, список гонщиков по прогрессу: ${sorted.map((user, index) => `${user.username} - ${index + 1}`).join(', ')}`;
    }

    public finishMessage(username: string, number: number): string {
        switch (number) {
            case 1:
                return 'НЕВЕРОЯТНО! У нас есть победитель и это ' + username + '!';
            case 2:
                return 'Вторым финишную черту пересекает ' + username + 'отличный результат!';
            case 3:
                return 'Третьим к финишу приходит ' + username + 'поздравляем!';
            default:
                return number + 'м - приходит ' + username;
        }
    }

    public winnersMessage(winners: string[]): string {
        return `Заезд завершается и вот наши победители:\n ${winners.map((winner, index) => `${index + 1}е место - ${winner}`).join('\n')}`;
    }

}