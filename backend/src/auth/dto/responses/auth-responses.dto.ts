export interface LoginResponseDto {
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}
