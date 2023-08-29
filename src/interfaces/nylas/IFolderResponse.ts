export interface IFolderResponse {
  account_id: string;
  display_name: string;
  id: string;
  name: "inbox" | "trash" | "sent" | "drafts" | "spam" | "important" | "archive" | "all";
  object: "folder";
}
