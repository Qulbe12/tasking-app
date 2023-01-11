export interface BoardCreate {
  title: string;
  description: string;
}

export interface BoardResponse {
  id: string;
  title: string;
  description: string;
  members: string[];
}

export interface BoardResponseDetailed {
  id: string;
  title: string;
  description: string;
  members: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  }[];
}
