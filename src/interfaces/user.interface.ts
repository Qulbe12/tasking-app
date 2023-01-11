export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  accessToken: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}
