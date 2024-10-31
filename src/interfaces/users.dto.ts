export interface CreateUserDTO {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
