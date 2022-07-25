import {MessageService} from "./messageService";

// Factory pattern

export class LvivMessageService extends MessageService {
    public greetMessage(): string {
        return 'На улице сейчас немного пасмурно, но на Львов Арена сейчас просто замечательная атмосфера: двигатели рычат, зрители улыбаются а гонщики едва заметно нервничают и готовят своих железных коней к заезду. А комментировать всё это действо буду я, Эскейп Энтерович и я рад вас приветствовать со словами Доброго Вам дня, господа!'
    }
}

export class KyivMessageService extends MessageService {
    public greetMessage(): string {
        return 'На улицах Киева как всегда шумно, но Киев Арена затихла в ожидании начала гонки: зрители уже в предвкушении, а гонщики едва заметно нервничают и готовятся к старту. А комментировать всё это действо буду я, Эскейп Энтерович и я рад вас приветствовать со словами Доброго Вам дня, господа!'
    }
}

export class KharkivMessageService extends MessageService {
    public greetMessage(): string {
        return 'На улице сейчас довольно солнечно, и на Харьков Арена просто замечательная атмосфера: двигатели рычат, зрители улыбаются а гонщики едва заметно нервничают и готовят своих железных коней к заезду. А комментировать всё это действо буду я, Эскейп Энтерович и я рад вас приветствовать со словами Доброго Вам дня, господа!'
    }
}

export class StandartMessageService extends MessageService {
    public greetMessage(): string {
        return 'Не уверен на какой мы планете, но здесь довольно солнечно и на этой Арене сейчас просто замечательная атмосфера: двигатели рычат, зрители улыбаются а гонщики едва заметно нервничают и готовят своих железных коней к заезду. А комментировать всё это действо буду я, Эскейп Энтерович и я рад вас приветствовать со словами Доброго Вам дня, господа!'
    }
}


export class ChooseService {
    public static factoryMethod(players): MessageService {
        const number = Math.floor(Math.random() * 4);
        switch (number) {
            case 0:
                return new LvivMessageService(players);
            case 1:
                return new KyivMessageService(players);
            case 2:
                return new KharkivMessageService(players);
            default:
                return new StandartMessageService(players);
        }
    }
}

