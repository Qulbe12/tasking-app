interface SearchRes {
  id: string;
  title: string;
  description?: string;
  board: {
    id: string;
    title: string;
    workspace: {
      id: string;
      title: string;
    };
  };

  workspace?: {
    id: string;
    title: string;
  };
}

export interface ISearchResponse {
  boards: SearchRes[];
  documents: SearchRes[];
  sheets: SearchRes[];
  templates: SearchRes[];
  workspaces: SearchRes[];
}
