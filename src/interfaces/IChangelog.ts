export interface IChangelog {
  by: {
    name: string;
    avatar: string;
    email: string;
  };
  change: {
    key: string;
    val: string;
    oldVal: string;
    type: string;
  }[];
  date: string;
  rid: string;
}
