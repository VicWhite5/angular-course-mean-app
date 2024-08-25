export interface User {
    id:    string;
    name:  string;
    email: string;
    roles: string[];
}

export interface Data {
    user:  User;
    token: string;
}