export interface IUpdateMessage {
  unread: boolean;
  starred: boolean;
  folder_id: string;
  label_ids: string[];
  metadata: Record<string, unknown>;
}
