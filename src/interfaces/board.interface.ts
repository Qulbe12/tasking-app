export interface BoardCreate {
  title: string;
  description: string;
  // TODO: add member interface
  members?: string[];
}

export interface BoardResponse {
  _id: string;
  userId: string;
  title: string;
  description: string;
  members: [
    {
      id: string;
      joinedStatus: true;
      _id: string;
      email: string;
      role: string;
    },
  ];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
