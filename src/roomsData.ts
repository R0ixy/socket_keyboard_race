export interface User {
    username: string;
    ready: boolean;
}

export const rooms: Map<string, User[] > = new Map();

