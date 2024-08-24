import { User } from "./user.interface";

export interface LoginResponse {
    data:       Data;
    statusCode: number;
}

export interface Data {
    user:  User;
    token: string;
}


