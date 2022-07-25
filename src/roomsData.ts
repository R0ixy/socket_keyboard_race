import {MessageSender} from "./commentator-bot/messageSender";

export interface User {
    username: string;
    ready: boolean;
    progress: number;
}

export interface Room {
    started: boolean;
    full: boolean
    users: User[];
    messageSender?: MessageSender;
}

export const rooms: Map<string, Room> = new Map();

