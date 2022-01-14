type TimeFields = {
    createdAt: string;
    updatedAt: string;
};

export type User = {
    id: number;
    email: string;
} & TimeFields;

export type Topic = {
    id: number;
    name: string;
    description: string;
    user: User;
    threads?: Thread[];
} & TimeFields;

export type Thread = {
    id: number;
    name: string;
    topic?: Topic;
    user: User;
    posts?: Post[];
} & TimeFields;

export type Post = {
    id: number;
    text: string;
    thread?: Thread;
    user?: User;
} & TimeFields;

export type Token = {
    token: string;
    expiration: string;
};

export type CurrentUserInfo = {
    user: User;
    token: Token;
};
