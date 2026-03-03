export interface LoginResponse {
    message: string;
    token: string;
    user: {
        userId: string;
        username: string;
        roles: string[];
    };
}