export interface UserResponse {
  token: string;
  user: {
    userType: string;
    companyName: string;
    companyWebsite: string;
    contactNumber: string;
    paid: boolean;
    imageUrl: string;
    _id: string;
    name: string;
    password: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}
